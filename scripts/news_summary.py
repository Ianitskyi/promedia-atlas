"""Facts for the news.promedia.report story about the latest registry snapshot.

Prints JSON with verified numbers only (taken from public/data), so the article
text never relies on estimates. Usage: python scripts/news_summary.py [YYYY-MM-DD]
"""
import collections
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'public/data'


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def main():
    index = load(DATA / 'history/index.json')
    snaps = [s['date'] for s in index['snapshots']]
    date = sys.argv[1] if len(sys.argv) > 1 else snaps[-1]
    pos = snaps.index(date)
    if pos == 0:
        raise SystemExit('No previous snapshot to compare with')
    prev_date = snaps[pos - 1]
    cur = load(DATA / f'history/snapshots/{date}.json')
    prev = load(DATA / f'history/snapshots/{prev_date}.json')
    regions = {r['id']: r['name'] for r in cur['regions']}
    by_id = {m['id']: m for m in cur['media']}
    prev_by_id = {m['id']: m for m in prev['media']}
    events = [e for e in index['events'] if e['to'] == date]

    def describe(kind, source):
        items = [source[e['id']] for e in events if e['kind'] == kind]
        cats = collections.Counter(c for m in items for c in m['categories'])
        regs = collections.Counter(regions.get(r, r) for m in items
                                   for r in {l['region'] for l in m['locations'] if l.get('region')})
        return {
            'count': len(items),
            'byCategory': cats.most_common(8),
            'byRegion': regs.most_common(8),
            'media': [{'id': m['id'], 'name': (m['names'] or [''])[0][:120],
                       'categories': m['categories']} for m in items],
        }

    changed = [e for e in events if e['kind'] == 'changed']
    substantive = [e for e in changed if set(e['fields']) - {'contacts'}]
    actions = load(DATA / 'regulatory-actions.json')['actions']
    new_actions = [a for a in actions if prev_date < a['date'] <= date]
    trends = load(DATA / 'history/trends.json')
    d = lambda iso: '.'.join(reversed(iso.split('-')))
    print(json.dumps({
        'snapshotDate': d(date),
        'previousSnapshotDate': d(prev_date),
        'mediaTotal': len(cur['media']),
        'mediaTotalPrevious': len(prev['media']),
        'registrantsTotal': len(cur['entities']),
        'registrantsPrevious': len(prev['entities']),
        'appeared': describe('appeared', by_id),
        'missing': describe('missing', prev_by_id),
        'changed': {
            'count': len(changed),
            'contactsOnly': len(changed) - len(substantive),
            'substantive': len(substantive),
            'substantiveByField': collections.Counter(
                f for e in substantive for f in e['fields'] if f != 'contacts').most_common(),
        },
        'fines': {
            'newSincePreviousSnapshot': [{k: a.get(k) for k in ('date', 'entityName', 'mediaName', 'amountUAH', 'reason', 'sourceUrl')}
                                         for a in new_actions],
            'totalInAtlas': len(actions),
        },
        'sinceObservationStart': {
            'from': d(trends['observationStart']),
            'netMediaChange': trends['netMediaChange'],
            'snapshots': trends['snapshotCount'],
        },
        'links': {
            'atlas': 'https://atlas.promedia.report/',
            'history': 'https://atlas.promedia.report/analytics/history',
            'categories': 'https://atlas.promedia.report/analytics/categories',
            'registrants': 'https://atlas.promedia.report/analytics/registrants',
            'fines': 'https://atlas.promedia.report/analytics/regulatory-actions',
            'source': index['snapshots'][pos].get('sourcePage'),
        },
        'notes': [
            'Appeared = present in this published file and absent in the previous one; it is not a registration date.',
            'Missing = absent from the newly published file; this is NOT proof of revoked registration.',
            'Fines in Atlas are added by editors from official reports; an empty list means none were added, not that none were imposed.',
        ],
    }, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
