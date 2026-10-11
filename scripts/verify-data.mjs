import fs from 'node:fs';
import assert from 'node:assert/strict';
const d=JSON.parse(fs.readFileSync(process.argv[2]||new URL('../public/data/registry.json',import.meta.url),'utf8'));
assert.match(d.date,/^\d{2}\.\d{2}\.\d{4}$/);
assert.ok(d.media.length>0);
assert.equal(new Set(d.media.map(m=>m.id)).size,d.media.length);
assert.ok(d.media.every(m=>/^[RIL]\d{2}-\d{4,5}$/.test(m.id)));
// sourceRows includes blank spreadsheet rows; importer reconciles non-empty IDs.
const mainRows=d.media.filter(m=>!m.foreign).reduce((n,m)=>n+m.details.length,0);
assert.ok(mainRows>0&&mainRows<=d.sourceRows);
assert.ok(d.media.some(m=>m.foreign));
for(const m of d.media){
  assert.ok(m.entities.every(e=>d.entities[e]));
  assert.ok(m.locations.every(l=>d.regions.some(r=>r.id===l.region)));
  assert.ok(m.locations.every(l=>l.city!=='м. Київ'||l.region==='kyiv-city'));
  assert.ok(m.details.every(r=>Number.isInteger(r.row)&&r.row>=3));
  assert.ok(Array.isArray(m.contacts));
  assert.ok(m.contacts.every(c=>c.role&&c.name&&(c.email||c.phone||c.address)));
}
assert.ok(Object.values(d.entities).every(e=>!e.code||/^\d{8}$/.test(e.code)));
assert.ok(d.media.some(m=>m.contacts.some(c=>c.email==='mhu.ukraine@gmail.com')),'Declared registry email must be retained');
assert.ok(d.media.filter(m=>m.foreign).every(m=>m.contacts.some(c=>c.address)),'Foreign entries must retain rights-holder address');
assert.ok(d.media.some(m=>m.details.length>10),'Repeated broadcast rows must be retained');
console.log(`Verified ${d.date}: ${d.media.length} unique IDs, source row reconciliation, declared contacts, region mappings and excluded personal tax codes.`);
