from pathlib import Path

def replace(path, pairs):
    text=Path(path).read_text(encoding='utf-8')
    for old,new in pairs:
        if old not in text: continue
        text=text.replace(old,new)
    Path(path).write_text(text,encoding='utf-8')

replace('app/atlas.tsx',[
("<h3>Записи джерела ({active.details.length})</h3>","<h3>{tr('Контактні дані з реєстру','Contact details from the registry')}</h3><ContactList items={active.contacts||[]} en={en}/><h3>{tr('Записи джерела','Source records')} ({active.details.length})</h3>"),
("region?regionName(region):'Географія реєстрації'","region?regionName(region):tr('Географія реєстрації','Registration geography')"),
("'Натисніть область'","tr('Натисніть область','Select a region')"),
('<span>Менше <i/> Більше медіа</span>',"<span>{tr('Менше','Fewer')} <i/> {tr('Більше медіа','More media')}</span>"),
('<h2>Каталог <span>',"<h2>{tr('Каталог','Directory')} <span>"),
('<span>Об’єднано за ідентифікатором</span>',"<span>{tr('Об’єднано за ідентифікатором','Grouped by identifier')}</span>"),
('<h3>За цими умовами медіа не знайдено</h3>',"<h3>{tr('За цими умовами медіа не знайдено','No media match these filters')}</h3>"),
('<p>Змініть пошук або скиньте фільтри.</p>',"<p>{tr('Змініть пошук або скиньте фільтри.','Change the search or reset the filters.')}</p>"),
('>← Назад</Button>',">{tr('← Назад','← Previous')}</Button>"),
('>Далі →</Button>',">{tr('Далі →','Next →')}</Button>"),
('<h2>Що показує вибірка</h2>',"<h2>{tr('Що показує вибірка','What the selection shows')}</h2>"),
('<h3>Види діяльності</h3>',"<h3>{tr('Види діяльності','Activity types')}</h3>"),
('<h3>Найбільші портфелі реєстрантів</h3>',"<h3>{tr('Найбільші портфелі реєстрантів','Largest registrant portfolios')}</h3>"),
('<h3>Регіони</h3>',"<h3>{tr('Регіони','Regions')}</h3>"),
('<footer>Атлас Меда · Проєкт ПроМедіа <span>Дані: 01.08.2026 · Довідка перевірена: 07.09.2026</span></footer>',"<footer>{tr('Атлас Меда · Проєкт ПроМедіа','Media Atlas · A ProMedia project')} <span>{tr('Дані: 01.08.2026 · Довідка перевірена: 07.09.2026','Data: 1 Aug 2026 · Guidance checked: 7 Sep 2026')}</span></footer>"),
('>Відкрити сторінку бренду · ',">{tr('Відкрити сторінку бренду · ','Open brand page · ')}"),
('>Усі медіа реєстранта</Button>',">{tr('Усі медіа реєстранта','All media by this registrant')}</Button>"),
('>Перевірити в реєстрі Нацради ↗</a>',">{tr('Перевірити в реєстрі Нацради ↗','Check the National Council registry ↗')}</a>"),
])

replace('app/media/[id]/profile.tsx',[
("<p>{m.technologies.join('; ')||'Не зазначено'}</p>{m.details.map","<p>{m.technologies.join('; ')||tr('Не зазначено','Not specified')}</p><h3>{tr('Контактні дані з реєстру','Contact details from the registry')}</h3><Contacts items={m.contacts||[]} en={en}/>{m.details.map"),
('<a href="/">Повернутися до каталогу</a>',"<a href={en?'/en':'/'}>{tr('Повернутися до каталогу','Return to the directory')}</a>"),
('>Завантажуємо сторінку медіа…</p>',">{tr('Завантажуємо сторінку медіа…','Loading media page…')}</p>"),
('{profile.media.length} реєстрацій',"{profile.media.length} {tr('реєстрацій','registrations')}"),
('} видів діяльності</span>',"} {tr('видів діяльності','activity types')}</span>"),
('>Реєстр на {profile.date}</span>',">{tr('Реєстр на','Registry as of')} {profile.date}</span>"),
('>Сайт медіа ↗</a>',">{tr('Сайт медіа ↗','Media website ↗')}</a>"),
('>Спільнота медіа ↗</a>',">{tr('Спільнота медіа ↗','Media community ↗')}</a>"),
('<p className="help">Кожен ідентифікатор збережено окремо разом із записами джерела.</p>',"<p className=\"help\">{tr('Кожен ідентифікатор збережено окремо разом із записами джерела.','Each identifier is preserved separately with its source records.')}</p>"),
('<h3>Назва в реєстрі</h3>',"<h3>{tr('Назва в реєстрі','Name in the registry')}</h3>"),
('<h3>Місцезнаходження</h3>',"<h3>{tr('Місцезнаходження','Location')}</h3>"),
('<h3>Технологія / вид медіа</h3>',"<h3>{tr('Технологія / вид медіа','Technology / media type')}</h3>"),
('<summary>Як об’єднано реєстрації</summary>',"<summary>{tr('Як об’єднано реєстрації','How registrations were grouped')}</summary>"),
('<p className="help">Матеріали, які редакція ПроМедіа пов’язала з цим брендом.</p>',"<p className=\"help\">{tr('Матеріали, які редакція ПроМедіа пов’язала з цим брендом.','Stories that ProMedia editors linked to this brand.')}</p>"),
('>Завантажуємо новини…</p>',">{tr('Завантажуємо новини…','Loading news…')}</p>"),
('<p className="news-empty">Пов’язаних публікацій поки немає.</p>',"<p className=\"news-empty\">{tr('Пов’язаних публікацій поки немає.','There are no related stories yet.')}</p>"),
('>Усі новини ПроМедіа ↗</a>',">{tr('Усі новини ПроМедіа ↗','All ProMedia news ↗')}</a>"),
('<footer><a href="/">Атлас Меда</a><span>Проєкт ПроМедіа · Реєстр Нацради</span></footer>',"<footer><a href={en?'/en':'/'}>{tr('Атлас Меда','Media Atlas')}</a><span>{tr('Проєкт ПроМедіа · Реєстр Нацради','A ProMedia project · National Council registry')}</span></footer>"),
])
