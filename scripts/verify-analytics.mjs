import assert from 'node:assert/strict';
import fs from 'node:fs';
const registry=JSON.parse(fs.readFileSync('public/data/registry.json','utf8'));
const contacts=JSON.parse(fs.readFileSync('public/data/contact-analytics.json','utf8'));
assert.equal(registry.media.filter(m=>m.foreign).length,42);
assert.equal(contacts.registrationDateAvailable,false);
for(const key of ['emails','phones','addresses']){
 const set=contacts[key];
 assert.equal(set.duplicateGroups,set.groups.length);
 assert.ok(set.groups.every(g=>g.count===g.mediaIds.length&&g.count>1));
}
assert.ok(contacts.emails.groups.every(g=>!g.label.includes('@')||g.label.includes('***@')));
assert.ok(contacts.phones.groups.every(g=>g.label.startsWith('••• ')));
assert.ok(contacts.addresses.groups.every(g=>g.label==='Спільна адреса'));
console.log(`Verified analytics: 42 foreign media; ${contacts.emails.duplicateGroups} masked email groups, ${contacts.phones.duplicateGroups} phone groups, ${contacts.addresses.duplicateGroups} address groups; no fabricated registration dates.`);
