"""Immutable public snapshots and observed changes (never inferred legal decisions)."""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://webportal.nrada.gov.ua/derzhavnyj-reyestr-sub-yektiv-informatsijnoyi-diyalnosti-u-sferi-telebachennya-i-radiomovlennya/'

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def dump(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))

def iso(data):
    return datetime.strptime(data['date'], '%d.%m.%Y').strftime('%Y-%m-%d')

def canonical(value):
    if isinstance(value, dict):
        return {k: canonical(v) for k, v in sorted(value.items()) if k != 'row'}
    if isinstance(value, list):
        return sorted([canonical(v) for v in value], key=dump)
    return value

def fields(media, data):
    return canonical({**media, 'entities': [data['entities'][e] for e in media['entities']]})

def compare(before, after):
    old = {m['id']: m for m in before['media']}
    new = {m['id']: m for m in after['media']}
    events = []
    for mid in sorted(old.keys() | new.keys()):
        left, right = old.get(mid), new.get(mid)
        changed = []
        if left is None:
            kind = 'appeared'
        elif right is None:
            kind = 'missing'
        else:
            a, b = fields(left, before), fields(right, after)
            changed = [k for k in sorted(a.keys() | b.keys()) if a.get(k) != b.get(k)]
            if not changed:
                continue
            kind = 'changed'
        events.append({'id': mid, 'kind': kind, 'from': iso(before), 'to': iso(after),
                       'names': (right or left)['names'], 'fields': changed})
    return events

def save_snapshot(data, workbook=None, source_url=None):
    date = iso(data)
    folder = ROOT / 'public/data/history/snapshots'
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / (date + '.json')
    if target.exists():
        if read(target) != data:
            raise ValueError('Refusing to overwrite an existing snapshot: ' + date)
        return
    target.write_text(dump(data), encoding='utf-8')
    manifest = ROOT / 'data/registry-sources.json'
    sources = read(manifest) if manifest.exists() else {}
    sources[date] = {'sourcePage': SOURCE, 'sourceUrl': source_url,
                     'capturedAt': datetime.now(timezone.utc).isoformat(),
                     'snapshotSha256': hashlib.sha256(target.read_bytes()).hexdigest(),
                     'workbookSha256': hashlib.sha256(workbook.read_bytes()).hexdigest() if workbook else None}
    manifest.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def rebuild():
    snapshots = [read(p) for p in sorted((ROOT / 'public/data/history/snapshots').glob('*.json'))]
    sources = read(ROOT / 'data/registry-sources.json')
    events, summaries, records = [], [], {}
    for i, data in enumerate(snapshots):
        date = iso(data)
        changes = compare(snapshots[i-1], data) if i else []
        events.extend(changes)
        present = {m['id'] for m in data['media']}
        for m in data['media']:
            record = records.setdefault(m['id'], {'firstObserved': date, 'baseline': i == 0, 'events': []})
            record.update(lastObserved=date, status='present', names=m['names'])
        for mid in records.keys() - present:
            records[mid]['status'] = 'missing'
        for event in changes:
            records[event['id']]['events'].append(event)
        summaries.append({'date': date, 'media': len(data['media']),
                          'sourceRows': sum(len(m['details']) for m in data['media']),
                          'counts': {k: sum(e['kind'] == k for e in changes) for k in ['appeared', 'missing', 'changed']},
                          'snapshotUrl': '/data/history/snapshots/' + date + '.json',
                          **sources[date]})
    result = {'schemaVersion': 1, 'snapshots': summaries, 'events': events, 'records': records,
              'methodology': 'Dates describe observations in published snapshots, not registration or revocation dates. Missing records do not establish revocation. Row positions and array order are ignored when comparing.'}
    (ROOT / 'public/data/history/index.json').write_text(dump(result), encoding='utf-8')
    print(dump({'snapshots': len(summaries), 'latest': summaries[-1], 'events': len(events)}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('candidate', type=Path)
    parser.add_argument('--workbook', type=Path, required=True)
    parser.add_argument('--source-url', required=True)
    args = parser.parse_args()
    current_path = ROOT / 'public/data/registry.json'
    current, candidate = read(current_path), read(args.candidate)
    if iso(candidate) < iso(current):
        raise ValueError('Cannot promote an older snapshot')
    # Fail closed on suspicious truncation or source layout changes.
    if not 0.8 <= len(candidate['media']) / len(current['media']) <= 1.25:
        raise ValueError('Unexpected size change; manual source review required')
    save_snapshot(current, ROOT / ('data/registry-source-' + iso(current) + '.xlsx') if (ROOT / ('data/registry-source-' + iso(current) + '.xlsx')).exists() else None)
    save_snapshot(candidate, args.workbook, args.source_url)
    rebuild()
    current_path.write_text(dump(candidate), encoding='utf-8')
