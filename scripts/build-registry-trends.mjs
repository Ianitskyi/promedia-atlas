// Aggregates saved registry snapshots and regulatory actions into one compact
// file for the "Registry changes" analytics page. Reads only already-verified
// data (public/data/history, public/data/regulatory-actions.json) and never
// infers anything beyond counting what is directly observed in snapshots.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));

const history=read('public/data/history/index.json');
const actions=read('public/data/regulatory-actions.json');

function categoryCounts(snapshot){
 const counts={};
 for(const m of snapshot.media)for(const c of m.categories)counts[c]=(counts[c]||0)+1;
 return counts;
}
function regionCounts(snapshot){
 const counts={};
 for(const m of snapshot.media){
  if(m.foreign){counts.foreign=(counts.foreign||0)+1;continue}
  for(const region of new Set(m.locations.map(l=>l.region)))counts[region]=(counts[region]||0)+1;
 }
 return counts;
}
function regionNames(first,latest){
 const names={foreign:'Іноземні медіа'};
 for(const r of [...first.regions,...latest.regions])names[r.id]=r.name;
 return names;
}
function delta(first,latest,names={}){
 const keys=new Set([...Object.keys(first),...Object.keys(latest)]);
 return [...keys].map(key=>({key,name:names[key]||key,first:first[key]||0,latest:latest[key]||0,delta:(latest[key]||0)-(first[key]||0)})).sort((a,b)=>b.delta-a.delta);
}

const snapshots=history.snapshots;
const firstMeta=snapshots[0],latestMeta=snapshots.at(-1);
const first=read('public'+firstMeta.snapshotUrl),latest=read('public'+latestMeta.snapshotUrl);

const totals=snapshots.slice(1).reduce((sum,s)=>({appeared:sum.appeared+s.counts.appeared,missing:sum.missing+s.counts.missing,changed:sum.changed+s.counts.changed}),{appeared:0,missing:0,changed:0});

const monthKey=date=>date.slice(0,7);
const actionsByMonth={};
let totalUAH=0;
for(const a of actions.actions){
 const key=monthKey(a.date);
 actionsByMonth[key]=(actionsByMonth[key]||0)+1;
 totalUAH+=a.amountUAH||0;
}
const finesTrend=Object.entries(actionsByMonth).sort(([a],[b])=>a.localeCompare(b)).map(([month,count])=>({month,count}));

const result={
 schemaVersion:1,
 generatedAt:new Date().toISOString(),
 observationStart:firstMeta.date,
 snapshotCount:snapshots.length,
 first:{date:firstMeta.date,media:firstMeta.media},
 latest:{date:latestMeta.date,media:latestMeta.media},
 netMediaChange:latestMeta.media-firstMeta.media,
 totalsSinceStart:totals,
 transitions:snapshots.slice(1).map((s,i)=>({from:snapshots[i].date,to:s.date,media:s.media,appeared:s.counts.appeared,missing:s.counts.missing,changed:s.counts.changed})),
 categoryDelta:delta(categoryCounts(first),categoryCounts(latest)),
 regionDelta:delta(regionCounts(first),regionCounts(latest),regionNames(first,latest)),
 fines:{
  reviewedAt:actions.reviewedAt,
  total:actions.actions.length,
  totalUAH,
  sinceStart:actions.actions.filter(a=>a.date>=firstMeta.date).length,
  byMonth:finesTrend,
 },
};

const outPath=path.join(root,'public/data/history/trends.json');
fs.writeFileSync(outPath,JSON.stringify(result,null,0));
if(snapshots.length<1)throw new Error('No snapshots to summarize');
if(result.categoryDelta.length===0)throw new Error('Category delta is empty; check snapshot data');
console.log(JSON.stringify({snapshots:snapshots.length,observationStart:firstMeta.date,latest:latestMeta.date,netMediaChange:result.netMediaChange,fines:result.fines.total}));
