import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const history=read('public/data/history/index.json');
const registry=read('public/data/registry.json');
const sources=read('data/registry-sources.json');
assert.ok(history.snapshots.length>=2);
for(const snapshot of history.snapshots){
 const bytes=fs.readFileSync('public'+snapshot.snapshotUrl);
 const data=JSON.parse(bytes);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),sources[snapshot.date].snapshotSha256);
 assert.equal(data.media.length,snapshot.media);
 for(const kind of ['appeared','missing','changed'])assert.equal(history.events.filter(e=>e.to===snapshot.date&&e.kind===kind).length,snapshot.counts[kind]);
}
const latest=history.snapshots.at(-1);
assert.deepEqual(read('public'+latest.snapshotUrl),registry);
const latestIds=new Set(registry.media.map(m=>m.id));
for(const [id,record] of Object.entries(history.records))assert.equal(record.status==='present',latestIds.has(id));
const actions=read('public/data/regulatory-actions.json');
assert.equal(new Set(actions.actions.map(a=>a.id)).size,actions.actions.length);
for(const action of actions.actions){
 assert.ok(action.sourceUrl.startsWith('https://webportal.nrada.gov.ua/'));
 assert.ok(action.amountUAH>0&&action.kind==='fine');
 for(const id of action.registryIds){
  const media=registry.media.find(m=>m.id===id);
  if(media)assert.ok(media.entities.some(e=>registry.entities[e].code===action.entityCode));
  else assert.ok(history.records[id]);
 }
}
console.log(`Verified ${history.snapshots.length} immutable snapshot hashes, observation states, event totals and ${actions.actions.length} sourced regulatory actions.`);
