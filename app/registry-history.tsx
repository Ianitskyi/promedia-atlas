'use client';
import {useEffect, useMemo, useState} from 'react';
import {makeTr, prefix, type Locale} from '@/lib/i18n';

type Change = {id:string;kind:'appeared'|'missing'|'changed';from:string;to:string;names:string[];fields:string[]};
export type Observation = {firstObserved:string;lastObserved:string;baseline:boolean;status:string;names:string[];events:Change[]};
type Snapshot = {date:string;media:number;sourceRows:number;counts:Record<string,number>;snapshotUrl:string;sourcePage:string;sourceUrl:string|null};
type History = {snapshots:Snapshot[];events:Change[];records:Record<string,Observation>};
type Action = {id:string;date:string;kind:string;entityName:string;mediaName:string;registryIds:string[];amountUAH:number;reason:string;reasonEn:string;sourceUrl:string};
type Actions = {reviewedAt:string;actions:Action[]};

function useJson<T>(url:string) {
 const [data,setData]=useState<T|null>(null),[error,setError]=useState(false);
 useEffect(()=>{const controller=new AbortController();setData(null);setError(false);fetch(url,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(value=>setData(value as T)).catch(e=>{if(e.name!=='AbortError')setError(true)});return()=>controller.abort()},[url]);
 return {data,error};
}
function label(kind:string,tr:ReturnType<typeof makeTr>){return kind==='appeared'?tr('З’явився у знімку','Appeared in snapshot'):kind==='missing'?tr('Відсутній у знімку','Missing from snapshot'):tr('Змінено відомості','Details changed')}
function fieldLabel(field:string,tr:ReturnType<typeof makeTr>){const fields:Record<string,[string,string]>={names:['назва','name'],entities:['реєстрант','registrant'],categories:['категорія','category'],locations:['місцезнаходження','location'],technologies:['технологія','technology'],contacts:['контактні відомості','contact details'],details:['записи джерела','source records']};return fields[field]?tr(...fields[field]):field}

export function ProfileHistory({records,locale}:{records:Record<string,Observation>;locale:Locale}) {
 const tr=makeTr(locale);
 return <section className="registry-history"><h2>{tr('Історія в реєстрі','Registry history')}</h2><p className="help">{tr('Це дати знімків реєстру, а не дати реєстрації. Відсутність у файлі не підтверджує скасування реєстрації.','These are snapshot dates, not registration dates. Absence from a file does not establish revocation.')}</p>{Object.entries(records).map(([id,r])=><details key={id}><summary><b>{id}</b> · {r.status==='missing'?tr('Відсутній в останньому знімку','Missing from latest snapshot'):tr('Є в останньому знімку','Present in latest snapshot')}</summary><p>{r.baseline?tr('Уже був у першому збереженому знімку:','Already in the first saved snapshot:'):tr('Уперше зафіксовано у знімку:','First observed in snapshot:')} {r.firstObserved}</p><p>{tr('Востаннє зафіксовано:','Last observed:')} {r.lastObserved}</p><ul>{r.events.map(e=><li key={e.to+e.kind}><time>{e.to}</time> — {label(e.kind,tr)}{e.fields.length>0&&': '+e.fields.map(f=>fieldLabel(f,tr)).join(', ')}</li>)}</ul></details>)}</section>
}

export function RegistryHistory({locale}:{locale:Locale}) {
 const tr=makeTr(locale),{data,error}=useJson<History>('/data/history/index.json');
 const [date,setDate]=useState(''),[kind,setKind]=useState('all'),[query,setQuery]=useState(''),[limit,setLimit]=useState(50);
 const selected=date||data?.snapshots.at(-1)?.date;
 const events=useMemo(()=>data?.events.filter(e=>e.to===selected&&(kind==='all'||e.kind===kind)&&`${e.id} ${e.names.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))||[],[data,selected,kind,query]);
 if(error)return <p role="alert">{tr('Не вдалося завантажити історію. Оновіть сторінку.','Could not load history. Reload the page.')}</p>;
 if(!data)return <p role="status">{tr('Завантажуємо історію…','Loading history…')}</p>;
 return <section className="registry-history"><p className="analysis-lead">{tr('Порівнюємо збережені знімки за ідентифікатором медіа. Поява означає, що запис уперше помічено між двома датами; зникнення не є доказом позбавлення реєстрації.','Saved snapshots are compared by media identifier. An appearance was observed between two dates; absence does not establish revocation.')}</p><div className="history-table-wrap"><table><thead><tr><th>{tr('Знімок','Snapshot')}</th><th>{tr('Медіа ID','Media IDs')}</th><th>{tr('З’явилися','Appeared')}</th><th>{tr('Відсутні','Missing')}</th><th>{tr('Змінені','Changed')}</th><th>{tr('Джерела','Sources')}</th></tr></thead><tbody>{data.snapshots.map((s,i)=><tr key={s.date}><th>{s.date}</th><td>{s.media.toLocaleString('uk-UA')}</td>{['appeared','missing','changed'].map(k=><td key={k}>{i?s.counts[k]:'—'}</td>)}<td><a href={s.snapshotUrl} download>JSON</a> · <a href={s.sourceUrl||s.sourcePage} target="_blank" rel="noreferrer">{tr('Нацрада ↗','Source ↗')}</a></td></tr>)}</tbody></table></div><p className="help">{tr('Зміни контактних відомостей включають уточнення адрес. Перестановка рядків не рахується зміною. Архів зберігає повні значення до і після зміни.','Contact changes include address corrections. Reordered rows are not counted as changes. Archives preserve full before and after values.')}</p><div className="history-filters"><label>{tr('Знімок','Snapshot')}<select value={selected} onChange={e=>{setDate(e.target.value);setLimit(50)}}>{data.snapshots.map(s=><option key={s.date}>{s.date}</option>)}</select></label><label>{tr('Тип зміни','Change type')}<select value={kind} onChange={e=>{setKind(e.target.value);setLimit(50)}}><option value="all">{tr('Усі','All')}</option>{['appeared','missing','changed'].map(k=><option value={k} key={k}>{label(k,tr)}</option>)}</select></label><label>{tr('Назва або ID','Name or ID')}<input value={query} onChange={e=>{setQuery(e.target.value);setLimit(50)}} type="search"/></label></div><p aria-live="polite">{tr('Знайдено змін:','Changes found:')} {events.length}</p><div className="history-events">{events.slice(0,limit).map(e=><article key={e.id}><strong>{e.names.join(' / ')||e.id}</strong><p>{e.id} · {label(e.kind,tr)} · {e.from} → {e.to}</p>{e.fields.length>0&&<p>{e.fields.map(f=>fieldLabel(f,tr)).join(', ')}</p>}</article>)}</div>{events.length>limit&&<button type="button" onClick={()=>setLimit(n=>n+50)}>{tr('Показати ще 50','Show 50 more')}</button>}</section>
}

export function RegulatoryActions({locale,registryIds}:{locale:Locale;registryIds?:string[]}) {
 const tr=makeTr(locale),{data,error}=useJson<Actions>('/data/regulatory-actions.json');
 if(error)return <p role="alert">{tr('Не вдалося завантажити заходи реагування.','Could not load regulatory actions.')}</p>;
 if(!data)return <p role="status">{tr('Завантажуємо заходи реагування…','Loading regulatory actions…')}</p>;
 const actions=data.actions.filter(a=>!registryIds||a.registryIds.some(id=>registryIds.includes(id)));
 return <section className="regulatory-actions"><h2>{tr('Штрафи: повідомлення Нацради','Fines reported by the National Council')}</h2><p className="help">{tr('Вибірка перевірених офіційних повідомлень, не повний перелік санкцій. Стан сплати та оскарження не встановлено. Відсутність записів не означає відсутності штрафів.','A selection of checked official reports, not a complete sanctions register. Payment and appeal status are unknown. No entries does not mean no fines.')} {tr('Перевірено:','Reviewed:')} {data.reviewedAt}.</p>{!actions.length?<p>{tr('У цій вибірці пов’язаних повідомлень поки немає.','No linked reports in this selection yet.')}</p>:actions.map(a=><article key={a.id}><p><time>{a.date}</time> · <strong>{a.amountUAH.toLocaleString('uk-UA',{style:'currency',currency:'UAH'})}</strong></p><h3>{a.mediaName} · {a.entityName}</h3><p>{locale==='en'?a.reasonEn:a.reason}</p><p>{a.registryIds.join(', ')||tr('Без прив’язки до реєстрації','Not linked to a registry entry')}</p><a href={a.sourceUrl} target="_blank" rel="noreferrer">{tr('Офіційне повідомлення ↗','Official report ↗')}</a></article>)}{registryIds&&<a href={prefix(locale)+'/analytics/regulatory-actions'}>{tr('Уся вибірка повідомлень →','All selected reports →')}</a>}</section>
}
