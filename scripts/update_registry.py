"""Discover the dated XLSX link; validate before promoting a new snapshot."""
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from registry_history import ROOT, SOURCE

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.href = None
        self.label = ''
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.href = dict(attrs).get('href')
            self.label = ''
    def handle_data(self, text):
        if self.href:
            self.label += text
    def handle_endtag(self, tag):
        if tag == 'a' and self.href:
            self.links.append((urljoin(SOURCE, self.href), self.label))
            self.href = None

def fetch(url, limit):
    if urlparse(url).hostname != 'webportal.nrada.gov.ua' or urlparse(url).scheme != 'https':
        raise ValueError('Unexpected source host')
    with urlopen(Request(url, headers={'User-Agent': 'ProMedia-Atlas/1.0 (+https://atlas.promedia.report)'}), timeout=90) as response:
        if urlparse(response.url).hostname != 'webportal.nrada.gov.ua':
            raise ValueError('Unexpected redirect')
        data = response.read(limit + 1)
    if len(data) > limit:
        raise ValueError('Source exceeds size limit')
    return data

def discover(html):
    parser = Links()
    parser.feed(html)
    candidates = []
    for url, label in parser.links:
        if not urlparse(url).path.lower().endswith('.xlsx') or 'суб' not in label.lower():
            continue
        date = re.search(r'\b(\d{2}\.\d{2}\.\d{4})\b', label)
        if date:
            candidates.append((datetime.strptime(date[1], '%d.%m.%Y').strftime('%Y-%m-%d'), url))
    if not candidates:
        raise ValueError('No dated registry XLSX link found; manual review required')
    latest = max(d for d, _ in candidates)
    urls = {u for d, u in candidates if d == latest}
    if len(urls) != 1:
        raise ValueError('Ambiguous latest source')
    return latest, urls.pop()

def main():
    date, url = discover(fetch(SOURCE, 5_000_000).decode('utf-8'))
    current = json.loads((ROOT / 'public/data/registry.json').read_text(encoding='utf-8'))
    current_date = datetime.strptime(current['date'], '%d.%m.%Y').strftime('%Y-%m-%d')
    if date < current_date:
        raise ValueError('Source page is older than the current dataset')
    content = fetch(url, 30_000_000)
    if not content.startswith(b'PK'):
        raise ValueError('Expected XLSX archive')
    if date == current_date:
        sources = json.loads((ROOT / 'data/registry-sources.json').read_text(encoding='utf-8'))
        if hashlib.sha256(content).hexdigest() != sources[date]['workbookSha256']:
            raise ValueError('Source changed under the same date; immutable snapshot retained, manual review required')
        print('No new snapshot; source checksum unchanged.')
        return
    workbook = ROOT / ('data/registry-source-' + date + '.xlsx')
    if workbook.exists() and workbook.read_bytes() != content:
        raise ValueError('Refusing to overwrite an existing source workbook')
    workbook.write_bytes(content)
    candidate = ROOT / 'outputs/registry-candidate.json'
    def run(*args):
        subprocess.run(args, cwd=ROOT, check=True)
    run(sys.executable, 'scripts/import_registry.py', str(workbook), '--date', date, '--output', str(candidate))
    run('node', 'scripts/verify-data.mjs', str(candidate))
    run(sys.executable, 'scripts/registry_history.py', str(candidate), '--workbook', str(workbook), '--source-url', url)
    run(sys.executable, 'scripts/build-contact-analytics.py', str(workbook))
    run('node', 'scripts/build-brands.mjs')
    run('node', 'scripts/build-registry-trends.mjs')
    for script in ['verify-data.mjs', 'verify-brands.mjs', 'verify-analytics.mjs', 'verify-history.mjs']:
        run('node', 'scripts/' + script)

if __name__ == '__main__':
    main()
