import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export const normalize=s=>s.normalize('NFKC').toLocaleLowerCase('uk').replace(/[«»“”„"']/g,'').replace(/\s+/g,' ').trim();
export function groupMedia(media,overrides){
 const parent=new Map(media.map(m=>[m.id,m.id]));
 const find=id=>{if(parent.get(id)!==id)parent.set(id,find(parent.get(id)));return parent.get(id)};
 const join=(a,b)=>parent.set(find(b),find(a));
 const seen=new Map();
 for(const m of media){
  // Same registrant AND whole normalized name, never owner alone or fuzzy matching.
  if(m.names.length===1)for(const e of m.entities){const key=e+'|'+normalize(m.names[0]);if(!normalize(m.names[0]))continue;if(seen.has(key))join(seen.get(key),m.id);else seen.set(key,m.id)}
 }
 for(const g of overrides.groups){for(const id of g.registryIds)if(!parent.has(id))throw Error('Unknown override ID '+id);g.registryIds.slice(1).forEach(id=>join(g.registryIds[0],id))}
 const groups=new Map();for(const m of media){const id=find(m.id);if(!groups.has(id))groups.set(id,[]);groups.get(id).push(m)}return [...groups.values()];
}
export function build(){
 const d=read('public/data/registry.json'),overrides=read('data/brand-overrides.json');
 const communityPath=path.join(root,'data/communities-source.json');
 if(!fs.existsSync(communityPath))fs.copyFileSync(path.join(root,'../promedia-communities/data/communities.json'),communityPath);
 const communities=read('data/communities-source.json').filter(c=>c.status==='approved'&&!c.example);
 const previous=fs.existsSync(path.join(root,'public/data/brand-index.json'))?read('public/data/brand-index.json'):{};
 const index={},directory=[],profiles=[];
 const grouped=groupMedia(d.media,overrides);
 for(const members of grouped){
  const ids=members.map(m=>m.id).sort(),explicit=overrides.groups.find(g=>g.registryIds.some(id=>ids.includes(id)));
  const prior=ids.map(id=>previous[id]?.id).filter(Boolean).sort();
  const id=explicit?.id||prior[0]||'atlas-'+createHash('sha256').update(ids[0]).digest('hex').slice(0,14);
  let name=explicit?.name||members[0].names.join(' / ')||d.entities[members[0].entities[0]].name;
  const entityIds=[...new Set(members.flatMap(m=>m.entities))],cities=[...new Set(members.flatMap(m=>m.locations.map(l=>l.city)))];
  const links=overrides.communityLinks.filter(x=>ids.includes(x.registryId));
  const explicitLinks=links.map(l=>{const c=communities.find(c=>c.id===l.communityId);if(!c)throw Error('Unknown community');return c});
  const sameCommunity=(group,c)=>group.some(m=>m.names.some(n=>normalize(n)===normalize(c.name))&&m.locations.some(l=>l.region===c.regionSlug));
  const automaticLinks=communities.filter(c=>sameCommunity(members,c)&&grouped.filter(g=>sameCommunity(g,c)).length===1);
  const linked=[...new Map([...explicitLinks,...automaticLinks].map(c=>[c.id,c])).values()];
  if(!explicit&&linked.length===1)name=linked[0].name;
  const newsIds=[id,...linked.map(c=>c.id)];
  const profile={id,name,registryIds:ids,newsIds,community:linked[0]||null,grouping:explicit?.reason||'Однакова повна назва та спільна особа або компанія, на яку оформлено медіа. Регістр літер, лапки й зайві пробіли нормалізовано.',media:members,entities:Object.fromEntries(entityIds.map(e=>[e,d.entities[e]])),regions:d.regions,date:d.date};
  profiles.push(profile);members.forEach(m=>index[m.id]={id,name,count:members.length});
  directory.push({id,name,city:cities.join('; '),registryIds:ids,newsIds,url:'https://atlas.promedia.report/media/'+id,status:'approved'});
 }
 const out=path.join(root,'public/data/brand-buckets');fs.mkdirSync(out,{recursive:true});
 // A small stable bucket keeps requests focused without creating thousands of deployment files.
 const buckets={};for(const p of profiles){const key=p.id.slice(6,7);(buckets[key]??={})[p.id]=p}
 for(const [key,value] of Object.entries(buckets))fs.writeFileSync(path.join(out,key+'.json'),JSON.stringify(value));
 fs.writeFileSync(path.join(root,'public/data/brand-index.json'),JSON.stringify(index));
 fs.writeFileSync(path.join(root,'public/data/media-directory.json'),JSON.stringify(directory));
 fs.writeFileSync(path.join(root,'app/brand-index.json'),JSON.stringify(index));
 fs.writeFileSync(path.join(root,'../promedia-news/public/data/atlas-brands.json'),JSON.stringify(directory));
 console.log(JSON.stringify({brands:profiles.length,buckets:Object.keys(buckets).length,mergedBrands:profiles.filter(p=>p.media.length>1).length,linkedCommunities:profiles.filter(p=>p.community).length,examples:profiles.filter(p=>p.id==='atlas-radio-nv'||p.id==='atlas-ukrainska-pravda'||p.community).map(p=>({id:p.id,name:p.name,count:p.media.length,newsIds:p.newsIds}))}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
