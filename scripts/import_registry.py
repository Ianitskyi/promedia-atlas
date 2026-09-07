"""Read registry as data only. Usage: python scripts/import_registry.py INPUT.xlsx"""
import sys,json,hashlib,re,xml.etree.ElementTree as ET
from pathlib import Path
import openpyxl
root=Path(__file__).resolve().parents[1]
w=openpyxl.load_workbook(sys.argv[1],read_only=True,data_only=True)
clean=lambda x: re.sub(r'\s+',' ',str(x or '')).strip()
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
    m=media.setdefault(mid,{'id':mid,'names':[],'entities':[],'categories':[],'locations':[],'technologies':[],'details':[],'foreign':False})
    for k,v in [('names',r[6] or r[7]),('entities',key),('categories',category),('technologies',r[10])]:
        if v and v not in m[k]:m[k].append(v)
    loc={'city':city,'region':region(city,area)}
    if loc not in m['locations']:m['locations'].append(loc)
    m['details'].append({'row':rownum,'city':r[8],'region':r[9],'channel':r[11],'frequency':r[12],'territory':r[13],'note':r[15]})
for rownum,raw in enumerate(list(w.worksheets[1].values)[2:],3):
    r=list(map(clean,raw)); mid=r[7]
    if not mid:continue
    key=hashlib.sha256(('foreign:'+r[4]).encode()).hexdigest()[:16]
    entities.setdefault(key,{'name':r[4],'code':'','basis':'name'})
    media[mid]={'id':mid,'names':[r[8]],'entities':[key],'categories':['Іноземне лінійне медіа'],'locations':[],'technologies':[],'details':[{'row':rownum,'city':'','region':'','channel':'','frequency':'','territory':r[11],'note':'Країна походження: '+r[10]+'. Формат: '+r[13]+'. Мови: '+r[14]}],'foreign':True}
data={'date':'01.08.2026','sourceRows':len(rows),'media':list(media.values()),'entities':entities,'regions':[{'id':s,'name':n} for n,s in zip(names,slugs)]+[{'id':'sevastopol','name':'м. Севастополь'},{'id':'unknown','name':'Не визначено'}]}
(root/'public/data').mkdir(parents=True,exist_ok=True)
(root/'public/data/registry.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
svg=ET.parse(root.parent/'promedia-communities/img/ukraine-oblasts.svg')
paths=[{'id':p.get('id'),'d':p.get('d')} for p in svg.getroot().iter() if p.tag.endswith('path') and p.get('id')]
(root/'app/map-paths.json').write_text(json.dumps(paths),encoding='utf-8')
assert len(media)==7230
assert sum(len(m['details']) for m in media.values())==10307
print(json.dumps({'media':len(media),'rows':len(rows),'entities':len(entities),'mapPaths':len(paths),'unknownLocations':sum(l['region']=='unknown' for m in media.values() for l in m['locations'])}))
