"""Read registry as data only. Usage: python scripts/import_registry.py INPUT.xlsx"""
import sys,json,hashlib,re,argparse
from datetime import datetime
from pathlib import Path
import openpyxl
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('input')
parser.add_argument('--date',required=True,help='Snapshot date YYYY-MM-DD')
parser.add_argument('--output',default='public/data/registry.json')
args=parser.parse_args()
snapshot_date=datetime.strptime(args.date,'%Y-%m-%d').strftime('%d.%m.%Y')
w=openpyxl.load_workbook(args.input,read_only=True,data_only=True)
assert len(w.worksheets)==2, 'Unexpected workbook sheets'
assert all(snapshot_date in str(s.cell(1,1).value) for s in w.worksheets), 'Workbook date mismatch'
assert w.worksheets[0].max_column==16 and w.worksheets[1].max_column==15, 'Unexpected workbook schema'
assert w.worksheets[0].cell(2,6).value=='Ідентифікатор медіа'
assert w.worksheets[1].cell(2,8).value=='Ідентифікатор медіа'
clean=lambda x: re.sub(r'\s+',' ',str(x or '')).strip()
def emails(value): return list(dict.fromkeys(x.lower() for x in re.findall(r'[\w.+-]+@[\w.-]+\.[A-Za-zА-Яа-яІіЇїЄє]{2,}',clean(value))))
def add_contact(media,contact):
    contact={k:v for k,v in contact.items() if v}
    if contact and contact not in media['contacts']: media['contacts'].append(contact)
names=['Черкаська','Чернігівська','Чернівецька','АР Крим','Дніпропетровська','Донецька','Івано-Франківська','Харківська','Херсонська','Хмельницька','Кіровоградська','Київська','м. Київ','Луганська','Львівська','Миколаївська','Одеська','Полтавська','Рівненська','Сумська','Тернопільська','Вінницька','Волинська','Закарпатська','Запорізька','Житомирська']
slugs=['cherkasy','chernihiv','chernivtsi','crimea','dnipropetrovsk','donetsk','ivano-frankivsk','kharkiv','kherson','khmelnytskyi','kirovohrad','kyiv','kyiv-city','luhansk','lviv','mykolaiv','odessa','poltava','rivne','sumy','ternopil','vinnytsia','volyn','zakarpattia','zaporizhia','zhytomyr']
def region(city,area):
    if city=='м. Київ': return 'kyiv-city'
    if 'Севастополь' in city: return 'sevastopol'
    for n,s in zip(names,slugs):
        if n in area or (s=='crimea' and 'Крим' in area): return s
    return 'unknown'
media={}; entities={}; rows=list(w.worksheets[0].values)[2:]
for rownum,raw in enumerate(rows,3):
    r=list(map(clean,raw)); name,city,area,code,category,mid=r[:6]
    if not mid: continue
    key=hashlib.sha256((('code:'+code) if code else ('name:'+name)).encode()).hexdigest()[:16]
    entities.setdefault(key,{'name':name,'code':code if re.fullmatch(r'\d{8}',code) else '', 'basis':'code' if code else 'name'})
    m=media.setdefault(mid,{'id':mid,'names':[],'entities':[],'categories':[],'locations':[],'technologies':[],'contacts':[],'details':[],'foreign':False})
    for k,v in [('names',r[6] or r[7]),('entities',key),('categories',category),('technologies',r[10])]:
        if v and v not in m[k]:m[k].append(v)
    loc={'city':city,'region':region(city,area)}
    if loc not in m['locations']:m['locations'].append(loc)
    for email in emails(r[14]): add_contact(m,{'role':'Суб’єкт у сфері медіа','name':name,'email':email,'phone':'','address':', '.join(x for x in [city,area] if x)})
    m['details'].append({'row':rownum,'city':r[8],'region':r[9],'channel':r[11],'frequency':r[12],'territory':r[13],'note':r[15]})
for rownum,raw in enumerate(list(w.worksheets[1].values)[2:],3):
    r=list(map(clean,raw)); mid=r[7]
    if not mid:continue
    key=hashlib.sha256(('foreign:'+r[4]).encode()).hexdigest()[:16]
    entities.setdefault(key,{'name':r[4],'code':'','basis':'name'})
    m={'id':mid,'names':[r[8]],'entities':[key],'categories':['Іноземне лінійне медіа'],'locations':[],'technologies':[],'contacts':[],'details':[{'row':rownum,'city':'','region':'','channel':'','frequency':'','territory':r[11],'note':'Країна походження: '+r[10]+'. Формат: '+r[13]+'. Мови: '+r[14]}],'foreign':True}
    for email in emails(r[2]): add_contact(m,{'role':'Заявник в Україні','name':r[0],'email':email,'phone':r[3],'address':''})
    add_contact(m,{'role':'Правовласник іноземного медіа','name':r[4],'email':'','phone':'','address':r[6]})
    media[mid]=m
data={'date':snapshot_date,'sourceRows':len(rows),'media':list(media.values()),'entities':entities,'regions':[{'id':s,'name':n} for n,s in zip(names,slugs)]+[{'id':'sevastopol','name':'м. Севастополь'},{'id':'unknown','name':'Не визначено'}]}
(root/'public/data').mkdir(parents=True,exist_ok=True)
assert len(media)>0 and all(re.fullmatch(r'[RIL]\d{2}-\d{4,5}',mid) for mid in media), 'Invalid media IDs'
assert sum(len(m['details']) for m in media.values())==sum(bool(r[5]) for r in rows)+sum(bool(r[7]) for r in list(w.worksheets[1].values)[2:]), 'Lost source rows'
output=root/args.output
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'date':snapshot_date,'media':len(media),'rows':len(rows),'entities':len(entities)}))
