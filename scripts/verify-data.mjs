import fs from 'node:fs';
import assert from 'node:assert/strict';
const d=JSON.parse(fs.readFileSync(new URL('../public/data/registry.json',import.meta.url),'utf8'));
assert.equal(d.media.length,7230);
assert.equal(new Set(d.media.map(m=>m.id)).size,7230);
assert.equal(d.media.filter(m=>m.foreign).length,42);
assert.equal(d.media.reduce((n,m)=>n+m.details.length,0),10307);
assert.equal(d.media.filter(m=>m.categories.includes('Онлайн-медіа')).length,1466);
assert.equal(d.media.filter(m=>m.categories.includes('Друковане медіа')).length,4045);
assert.equal(d.media.filter(m=>m.categories.includes('Радіомовлення з використанням радіочастотного спектра')).length,517);
for(const m of d.media){
  assert.ok(m.entities.every(e=>d.entities[e]));
  assert.ok(m.locations.every(l=>d.regions.some(r=>r.id===l.region)));
  assert.ok(m.locations.every(l=>l.city!=='м. Київ'||l.region==='kyiv-city'));
  assert.ok(m.details.every(r=>Number.isInteger(r.row)&&r.row>=3));
}
assert.ok(Object.values(d.entities).every(e=>!e.code||/^\d{8}$/.test(e.code)));
assert.ok(d.media.some(m=>m.details.length>10),'Repeated broadcast rows must be retained');
console.log('Verified: 7,230 unique IDs, 10,307 source rows, category totals, region mappings, source references, and excluded personal tax codes.');
