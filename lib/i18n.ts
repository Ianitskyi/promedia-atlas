// Мови Атласу: uk (корінь /), en (/en) та кримськотатарська латинкою crh (/crh).
// Компоненти й далі пишуть пари tr('укр', 'English'); для crh переклад
// береться зі словника CRH за англійським текстом, а якщо його немає —
// показується український текст (як на інших сайтах мережі ПроМедіа).
export type Locale = 'uk' | 'en' | 'crh';
export const LOCALES: Locale[] = ['uk', 'en', 'crh'];

export const prefix = (locale: Locale) => (locale === 'uk' ? '' : '/' + locale);

export const CRH: Record<string, string> = {
  // Навігація та мережа ПроМедіа
  'Media Atlas navigation': 'Mediya Atlası navigatsiyası',
  '← ProMedia': '← ProMedia',
  'Map and directory': 'Harita ve katalog',
  'Analytics': 'Analitika',
  'How to register media': 'Mediyanı nasıl qayd ettirmeli',
  'ProMedia projects': 'ProMedia loyihaları',
  'News': 'Haberler',
  'Community Map': 'Cemaatlar haritası',
  'Journalism Schools Ranking': 'Jurnalistika fakülteleri reytingi',
  'Research': 'Tedqiqatlar',
  'Media Atlas': 'Mediya Atlası',

  // Головна: карта й каталог
  'Key registry analytics': 'Reyestrniñ esas analitikası',
  'AT A GLANCE': 'QISQA BAQIŞ',
  'Registry analytics': 'Reyestr analitikası',
  'All analytics →': 'Bütün analitika →',
  'Activity types': 'Faaliyet türleri',
  'Largest categories in the selection': 'Saylamdaki eñ büyük kategoriyalar',
  'Explore categories →': 'Kategoriyalarnı açmaq →',
  'Registration geography': 'Qayd coğrafiyası',
  'Regions with the most media identifiers': 'Eñ çoq mediya qayd etilgen vilâyetler',
  'Explore geography →': 'Coğrafiyanı açmaq →',
  'Registrant portfolios': 'Reyestrantlarnıñ portfelleri',
  'People and companies with the most media identifiers': 'Eñ çoq mediya identifikatorı olğan şahıslar ve şirketler',
  'Explore portfolios →': 'Portfellerni açmaq →',
  'REGISTERED MEDIA DATA AS OF 1 AUGUST 2026': '2026 SENESİ 1 AVGUST VAZİYETİNE KÖRE QAYD ETİLGEN MEDİYALAR MALÜMATI',
  'Explore Ukraine’s media landscape.': 'Ukrainanıñ mediya manzarasını tedqiq etiñiz.',
  'National Council registry ↗': 'Milliy Şuranıñ reyestri ↗',
  'Could not load the registry.': 'Reyestrni yüklemek mümkün olmadı.',
  'Try again': 'Bir daa deñemek',
  'Loading 7,230 registry records…': 'Reyestrniñ 7 230 qaydı yüklene…',
  'Interactive registry statistics': 'Reyestrniñ interaktiv statistikası',
  'unique identifiers': 'yegâne identifikator',
  'people or companies the media outlets are registered to*': 'saylamda mediya qayd etilgen şahıs ya da şirket*',
  'activity categories': 'faaliyet kategoriyası',
  'source rows': 'menbada satır',
  'Find media': 'Mediya tapmaq',
  'Name or identifier': 'Ad ya da identifikator',
  'For example, Suspilne': 'Meselâ, Suspilne',
  'Registration region': 'Qayd vilâyeti',
  'All Ukraine': 'Bütün Ukraina',
  'Locality': 'Yaşayış yeri',
  'All localities': 'Bütün yaşayış yerleri',
  'Activity type': 'Faaliyet türü',
  'All categories': 'Bütün kategoriyalar',
  'Technology / media type': 'Tehnologiya / mediya türü',
  'All technologies': 'Bütün tehnologiyalar',
  'Media origin': 'Mediyanıñ menşesi',
  'Ukrainian and foreign': 'Ukrain ve ecnebiy',
  'Ukrainian only': 'Tek ukrain',
  'Foreign only': 'Tek ecnebiy',
  'Person or company the media outlet is registered to': 'Mediya qayd etilgen şahıs ya da şirket',
  'Remove ×': 'Çıqarmaq ×',
  'Reset filters': 'Süzgüçlerni sıfırlamaq',
  'The map shows the location of the person or company the media outlet is registered to. It may differ from the newsroom and broadcast area.':
    'Harita mediya qayd etilgen şahıs ya da şirketniñ yerini köstere. O, redaktsiyanıñ yerinden ve yayın saasından farqlı olabilir.',
  'Select a region': 'Vilâyetni saylañız',
  'Fewer': 'Az',
  'More media': 'Daa çoq mediya',
  'Directory': 'Katalog',
  'Grouped by identifier': 'İdentifikator boyunca birleştirildi',
  'No media match these filters': 'Bu şartlar boyunca mediya tapılmadı',
  'Change the search or reset the filters.': 'Qıdıruvnı deñiştiriñiz ya da süzgüçlerni sıfırlañız.',
  'brand registrations →': 'brend qaydı →',
  '← Previous': '← Keri',
  'Next →': 'İleri →',
  'What the selection shows': 'Saylam neni köstere',
  'Largest portfolios by person or company the media outlets are registered to': 'Mediya qayd etilgen şahıslar ya da şirketlerniñ eñ büyük portfelleri',
  'Regions': 'Vilâyetler',
  'Media Atlas · A ProMedia project': 'Mediya Atlası · ProMedia loyihası',
  'Data: 1 Aug 2026 · Guidance checked: 7 Sep 2026': 'Malümat: 01.08.2026 · Qılavuz teşkerildi: 07.09.2026',
  'Report an error': 'Hata aqqında bildirmek',
  'Open brand page · ': 'Brend saifesini açmaq · ',
  'All media registered to this person or company': 'Bu şahıs ya da şirketke qayd etilgen bütün mediyalar',
  'Contact details from the registry': 'Reyestrdeki bağlantı malümatı',
  'Source records': 'Menba qaydları',
  'Check the National Council registry ↗': 'Milliy Şura reyestrinde teşkermek ↗',
  'Not listed in the published registry.': 'İlân etilgen reyestrde kösterilmegen.',
  'Applicant in Ukraine': 'Ukrainadaki arza berici',
  'Foreign media rights holder': 'Ecnebiy mediyanıñ aqları saibi',
  'Media entity': 'Mediya subyekti',
  'Foreign media': 'Ecnebiy mediyalar',

  // Сторінка медіабренду
  'Return to the directory': 'Katalogğa qaytmaq',
  'Loading media page…': 'Mediya saifesi yüklene…',
  'PUBLIC MEDIA BRAND PAGE': 'MEDİYA BRENDİNİÑ AÇIQ SAİFESİ',
  'registrations': 'qayd',
  'activity types': 'faaliyet türü',
  'Registry as of': 'Reyestr vaziyeti',
  'Media website ↗': 'Mediyanıñ saytı ↗',
  'Media community ↗': 'Mediyanıñ cemaati ↗',
  'DECLARED CONTACT DETAILS': 'BİLDİRİLGEN BAĞLANTI MALÜMATI',
  'How to contact': 'Nasıl bağlanmalı',
  'Reproduced from the National Council’s published registry as of 1 August 2026.': 'Malümat Milliy Şuranıñ 01.08.2026 vaziyetine köre ilân etilgen reyestrinden alındı.',
  'Registrations under this brand': 'Bu brendniñ qaydları',
  'Each identifier is preserved separately with its source records.': 'Er bir identifikator menba qaydlarınen beraber ayrı saqlana.',
  'Name in the registry': 'Reyestrdeki adı',
  'Location': 'Yeri',
  'Not specified': 'Kösterilmegen',
  'People or companies the media outlets are registered to': 'Mediya qayd etilgen şahıslar ya da şirketler',
  'How registrations were grouped': 'Qaydlar nasıl birleştirildi',
  'NEWS ABOUT THIS MEDIA BRAND': 'BU MEDİYA AQQINDA HABERLER',
  'ProMedia coverage': 'ProMedia nazarında',
  'Stories that ProMedia editors linked to this brand.': 'ProMedia redaktsiyası bu brendnen bağlağan materiallar.',
  'Loading news…': 'Haberler yüklene…',
  'There are no related stories yet.': 'Şimdilik bağlı neşirler yoq.',
  'All ProMedia news ↗': 'Bütün ProMedia haberleri ↗',
  'A ProMedia project · National Council registry': 'ProMedia loyihası · Milliy Şura reyestri',
  'No contact information is listed in the published registry.': 'İlân etilgen reyestrde bağlantı malümatı kösterilmegen.',
  ' — Media Atlas': ' — Mediya Atlası',

  // Аналітика
  'ANALYTICAL CONTENTS': 'ANALİTİKANIÑ MÜNDERİCESİ',
  'Explore the registry': 'Reyestrni tedqiq etiñiz',
  'Open one analytical aspect at a time. Each page explains the limits of the source data.': 'Analitikanıñ bir cihetini açıñız. Er saifede menbanıñ sıñırları añlatıla.',
  '← Analytical contents': '← Analitikanıñ mündericesi',
  'MEDIA REGISTRY ANALYTICS': 'MEDİYA REYESTRİNİÑ ANALİTİKASI',
  'Loading data…': 'Malümat yüklene…',
  'Media outlets registered to the same person or company do not by themselves prove common editorial control or ownership.':
    'Mediyalarnıñ bir şahıs ya da şirketke qayd etilmesi özü umumiy redaktsiya nezaretini ya da mülkiyetni isbatlamay.',
  'Counts may overlap when one identifier has several records.': 'Bir identifikatornıñ bir qaç qaydı olsa, sayılar üst-üste kelip olur.',
  'Top values': 'Eñ büyük qıymetler',
  'A visual comparison of the largest groups in this section.': 'Bu bölükteki eñ büyük gruppalarnıñ körgezmeli qıyaslaması.',
  'media IDs': 'mediya ID',
  'Counts may overlap when one identifier has several records. Select a category to see its media outlets.':
    'Bir identifikatornıñ bir qaç qaydı olsa, sayılar üst-üste kelip olur. Mediyalarnı körmek içün kategoriyağa basıñız.',
  'Media identifiers by activity type': 'Faaliyet türleri boyunca mediya identifikatorları',
  'The chart shows the largest activity categories in the registry.': 'Grafik reyestrdeki eñ büyük faaliyet kategoriyalarını köstere.',
  'One media outlet may operate in several regions, so it can be counted in more than one region. Select a region to see its media outlets.':
    'Bir mediya bir qaç vilâyette çalışıp ola, bu sebepten o bir qaç vilâyette sayılıp ola. Mediyalarnı körmek içün vilâyetke basıñız.',
  'Top registration regions': 'Eñ büyük qayd vilâyetleri',
  'The chart highlights regions with the largest numbers of registered media identifiers.': 'Grafik eñ çoq mediya identifikatorı qayd etilgen vilâyetlerni köstere.',
  'Media outlets registered to the same person or company do not by themselves prove common editorial control or ownership. Select a person or company to see the media registered to it.':
    'Mediyalarnıñ bir şahıs ya da şirketke qayd etilmesi özü umumiy redaktsiya nezaretini ya da mülkiyetni isbatlamay. Oña qayd etilgen mediyalarnı körmek içün adğa basıñız.',
  'Largest registrant portfolios': 'Reyestrantlarnıñ eñ büyük portfelleri',
  'The chart shows the entities with the most media identifiers in the registry.': 'Grafik reyestrde eñ çoq mediya identifikatorı olğan subyektlerni köstere.',
  'This grouping is calculated automatically from the registered person or company name in the public registry. The donut chart counts each media identifier once, by the first listed entity. The breakdown below is an analytical aid, not an official legal classification.':
    'Bu gruppalaştırma açıq reyestrdeki şahıs ya da şirket adı boyunca avtomatik esaplandı. Dairesel diagramma er mediya identifikatorını bir kere, birinci kösterilgen subyekt boyunca saya. Bu resmiy huquqiy tasnif degil, analitik yardımdır.',
  'Media identifiers by legal form': 'Huquqiy şekiller boyunca mediya identifikatorları',
  'A share view of the main legal forms behind registered media identifiers.': 'Mediya identifikatorları qayd etilgen esas huquqiy şekillerniñ payları.',
  'Legal forms compared': 'Huquqiy şekillerniñ qıyaslaması',
  'The same data as bars, useful for comparing smaller groups.': 'Kiçik gruppalarnı qıyaslamaq içün aynı malümat sütünlerde.',
  'entities': 'subyekt',
  'Largest entities in this group by number of media identifiers:': 'Bu gruppada mediya identifikatorları sayısı boyunca eñ büyük subyektler:',
  'The source does not contain registration dates': 'Menbada qayd tarihleri yoq',
  'The workbook only states that the registry is current as of 1 August 2026. A registration date cannot be reliably inferred from the identifier, so the atlas does not fabricate a timeline.':
    'Cedvelde tek reyestrniñ 01.08.2026 vaziyetine köre aktual olğanı kösterile. Qayd tarihini identifikatordan işançlı çıqarmaq mümkün degil, bu sebepten atlas uydurma zaman dinamikası yaratmay.',
  'media IDs covered': 'mediya ID gruppalarda',
  'Matches are leads for further research, not proof of common ownership. Contact details are reproduced in full from the National Council’s public registry.':
    'Tesadüfler — daa da teşkermek içün işaretler, umumiy mülkiyetniñ delili degil. Bağlantı malümatı Milliy Şuranıñ açıq reyestrinden tolusınen alındı.',
  'Duplicate contact groups': 'Tekrarlanğan bağlantılar gruppaları',
  'A quick view of where repeated contact details appear most often.': 'Bağlantı malümatı eñ sıq tekrarlanğan yerlerge qısqa baqış.',
  'duplicate groups': 'tesadüf gruppası',
  'duplicate groups covering': 'tesadüf gruppası, olar qaplay',
  'media identifiers': 'mediya identifikatorını',
  'Found an error or inaccuracy?': 'Hata ya da yañlışlıq taptıñızmı?',
  'Matching email groups': 'Email tesadüfleri gruppaları',
  'Matching phone groups': 'Telefon tesadüfleri gruppaları',
  'Matching address groups': 'Adres tesadüfleri gruppaları',
  'Matching emails': 'Email tesadüfleri',
  'Matching phones': 'Telefon tesadüfleri',
  'Matching addresses': 'Adres tesadüfleri',

  // Методологія, панель реєстраційних даних, сторінка бренду
  'Ukraine’s borders include the temporarily occupied territories. No records does not mean no media. Foreign media are available in the directory but are not marked on this map.':
    'Ukrainanıñ sıñırlarına muvaqqat işğal etilgen topraqlar da kire. Qaydlarnıñ olmaması mediyanıñ olmamasını bildirmey. Ecnebiy mediyalar katalogda bar, amma bu haritada işaretlenmey.',
  'Totals change with the filters. The number of registrations does not measure audience or influence.':
    'Neticeler süzgüçlernen beraber deñişe. Qaydlar sayısı auditoriyanı ya da tesirni ölçemey.',
  'Several media outlets registered to the same person or company do not always form a media group. This file does not describe ownership or beneficial owners.':
    'Bir qaç mediyanıñ bir şahıs ya da şirketke qayd etilmesi her vaqıt mediya gruppası demek degil. Bu fayl mülkiyetni ve benefitsiarlarnı tarif etmey.',
  'How to read this data · methodology and limitations':
    'Bu malümatnı nasıl oqumalı · metodologiya ve sıñırlar',
  'Source: two Excel sheets from the National Council as of 1 August 2026. 10,265 main rows were grouped into 7,188 identifiers, and 42 foreign linear media were added. Repeated records are kept in the cards. The list also includes providers and service suppliers.':
    'Menba — Milliy Şuranıñ 01.08.2026 vaziyetine köre eki Excel cedveli. 10 265 esas satır 7 188 identifikator boyunca birleştirildi; 42 ecnebiy sızıqlı mediya qoşuldı. Tekrarlanğan qaydlar kartoçkalarda saqlandı. Cedvelge provayderler ve hızmet berüvciler de kire.',
  '* People or companies the media outlets are registered to were grouped by code or, where it is missing, by the exact normalized name. This is the atlas’s own calculation and may differ from the official number of entities. For foreign media, the name of the foreign organization is used rather than its representative. A portfolio does not confirm common ownership.':
    '* Mediya qayd etilgen şahıslar ya da şirketler kod boyunca, kod olmasa — anıq normallaştırılğan ad boyunca birleştirildi. Bu atlasnıñ öz esabı, o subyektlerniñ resmiy sayısından farqlı olabilir. Ecnebiy mediyalar içün vekilniñ degil, ecnebiy teşkilâtnıñ adı qullanıldı. Portfel umumiy mülkiyetni tasdiqlamay.',
  'An empty region for the city of Kyiv was normalized as Kyiv City. The map shows regions, not newsroom coordinates or signal coverage. Personal tax numbers of individuals and contact emails are not included in the public dataset. Each card shows the row number in the source sheet for verification.':
    'Kiev şeeri içün boş vilâyet Kiev şeeri olaraq normallaştırıldı. Harita redaktsiyalarnıñ koordinatlarını ya da sinyal qaplavını degil, vilâyetlerni köstere. Ferdiy şahıslarnıñ vergi nomeraları ve kontakt email-ler açıq malümat toplumına kirsetilmedi. Kartoçkada teşkermek içün menba cedveliniñ satır nomerası kösterile.',
  'Registration does not confirm that a media outlet actually operates or its quality. Online media register voluntarily, so this directory does not cover the whole media market. Category or region shares may overlap when one identifier has several matching records.':
    'Qayd mediyanıñ aqiqiy çalışqanını ya da keyfiyetini tasdiqlamay. Onlayn mediyalar ihtiyariy qayd etile, bu sebepten bu katalog bütün mediya bazarını qaplamay. Bir identifikatornıñ bir qaç uyğun qaydı olsa, kategoriya ya da vilâyet payları üst-üste kelip olur.',
  'Open the source on the National Council website ↗':
    'Menbanı Milliy Şuranıñ saytında açmaq ↗',
  'registrations →':
    'qayd →',
  'Foreign linear media':
    'Ecnebiy sızıqlı mediyalar',
  'Main registry':
    'Esas reyestr',
  'Grouped by name: the code is missing or not used for this sheet.':
    'Ad boyunca birleştirüv: kod yoq ya da bu cedvel içün qullanılmay.',
  'Foreign media — outside the map of Ukraine':
    'Ecnebiy mediya — Ukraina haritasından tışta',
  'Row':
    'Satır',
  'Region':
    'Vilâyet',
  'Channel':
    'Kanal',
  'Frequency':
    'Çastota',
  'Distribution / service area':
    'Yayılma / hızmet saası',
  'Area':
    'Saa',
  'Note':
    'Qayd',
  'Map of Ukraine’s regions':
    'Ukraina vilâyetleriniñ haritası',
  'media':
    'mediya',
  'Foreign media outlet':
    'Ecnebiy mediya',
  'Registration data ':
    'Qayd malümatı ',
  'EDRPOU: ':
    'EDRPOU: ',
  'Some news is temporarily unavailable.':
    'Haberlerniñ bir qısmı muvaqqat erişilmez.',
  'Could not load the news.':
    'Haberlerni yüklemek mümkün olmadı.',
  'This page does not exist.':
    'Böyle saife yoq.',
  'Could not load the page.':
    'Saifeni yüklemek mümkün olmadı.',
  'A shared owner does not by itself merge different brands. Similar names of media registered to different people or companies stay separate until verified. This page is based on registry data and does not confirm actual operation or ownership structure.':
    'Umumiy saip özü türlü brendlerni birleştirmey. Türlü şahıslar ya da şirketlerge qayd etilgen mediyalarnıñ beñzer adları teşkerüvge qadar ayrı qala. Bu saife reyestr malümatına esaslana, aqiqiy faaliyetni ya da mülkiyet strukturasını tasdiqlamay.',
  'Check the original source ↗':
    'Asıl menbanı teşkermek ↗',

  'Same full name and the same person or company the media outlet is registered to. Letter case, quotes and extra spaces were normalized.':
    'Ayn tolu ad ve mediya qayd etilgen ayn şahıs ya da şirket. Arif registri, tırnaqlar ve artıq boşluqlar normallaştırıldı.',

  // Розділи аналітики
  'Geography': 'Coğrafiya',
  'Distribution by region and foreign media.': 'Qaydlarnıñ vilâyetler boyunca bölünüvi ve ayrıca ecnebiy mediyalar.',
  'Registry structure by media activity.': 'Mediya faaliyeti türleri boyunca reyestrniñ strukturası.',
  'Legal forms': 'Huquqiy şekiller',
  'How many media identifiers are registered to LLCs, sole proprietors, NGOs and other entity types.': 'Qaç mediya MMŞ, ФОП / FOP, İT ve diger subyekt türlerine qayd etilgen.',
  'Person and company portfolios': 'Şahıslar ve şirketlerniñ portfelleri',
  'Entities with the largest numbers of media identifiers.': 'Eñ çoq mediya identifikatorı olğan subyektler.',
  'Shared contacts': 'Bağlantı tesadüfleri',
  'Repeated emails, phones and addresses as review signals.': 'Teşkerüv içün işaret olaraq tekrarlanğan email, telefon ve adresler.',

  // Види діяльності
  'Online media': 'Onlayn mediya',
  'Print media': 'Basma mediya',
  'Radio broadcasting using radio-frequency spectrum': 'Radioçastota spektrini qullanğan radio yayını',
  'Television broadcasting using radio-frequency spectrum': 'Radioçastota spektrini qullanğan televideniye yayını',
  'Linear television without radio-frequency spectrum': 'Radioçastota spektrisiz sızıqlı televideniye',
  'Linear radio without radio-frequency spectrum': 'Radioçastota spektrisiz sızıqlı radio',
  'Provider': 'Provayder',
  'Platform operator': 'Platforma operatorı',
  'On-demand audiovisual media': 'Sımarış boyunca audiovizual mediya',
  'Electronic communications service': 'Elektron kommunikatsiyalar hızmeti',

  // Юридичні форми
  'Limited liability companies': 'Mesüliyeti sıñırlı şirketler',
  'Ukrainian LLCs and equivalent names in the registry': 'Ukrain MMŞ-leri ve reyestrde olarğa muadil adlar',
  'Sole proprietors': 'Ferdiy işbilirmenler (ФОП / FOP)',
  'Individual entrepreneurs registered as media entities': 'Mediya subyekti olaraq qayd etilgen ferdiy işbilirmenler',
  'Private enterprises': 'Hususiy müessiseler',
  'Private and small private enterprises': 'Hususiy ve kiçik hususiy müessiseler',
  'Individual registrants': 'Ferdiy şahıslar',
  'Full personal names without an FOP marker; the registration form is not stated': 'ФОП / FOP işaretisiz tolu adlar; qayd şekli kösterilmegen',
  'Subsidiary enterprises': 'Qız müessiseler',
  'Collective enterprises': 'Kollektiv müessiseler',
  'NGOs and civic unions': 'İçtimaiy teşkilâtlar ve birlikler',
  'Civil society organizations and civic unions': 'İçtimaiy teşkilâtlar ve içtimaiy birlikler',
  'Joint-stock companies': 'Aksioner şirketler',
  'Joint-stock companies, including public and private JSCs': 'Aksioner şirketler, şu cümleden umumiy ve hususiy AŞ',
  'Municipal entities': 'Belediye subyektleri',
  'Municipal enterprises, institutions and organizations': 'Belediye müessiseleri, idareleri ve teşkilâtları',
  'State entities': 'Devlet subyektleri',
  'State enterprises, institutions and organizations': 'Devlet müessiseleri, idareleri ve teşkilâtları',
  'Charitable organizations': 'Hayriye teşkilâtları',
  'Charities and charitable foundations': 'Hayriye teşkilâtları ve fondları',
  'Educational and research institutions': 'Tasil ve ilmiy müessiseler',
  'Universities, academies, institutes and education providers': 'Universitetler, akademiyalar, institutlar ve tasil müessiseleri',
  'Cooperatives and consumer societies': 'Kooperativler ve istihlâk cemiyetleri',
  'Political parties': 'Siyasiy fırqalar',
  'Political parties and their local branches': 'Fırqalar ve olarnıñ yerli bölükleri',
  'Trade unions': 'Kasaba birlikleri',
  'Trade unions and their organizations': 'Kasaba birlikleri ve olarnıñ teşkilâtları',
  'Religious organizations': 'Diniy teşkilâtlar',
  'Religious communities, churches, eparchies and dioceses': 'Diniy cemaatler, kiliseler, eparhiyalar ve diotsezler',
  'Foreign entities': 'Ecnebiy subyektler',
  'Foreign companies and representative offices': 'Ecnebiy şirketler ve vekilhaneler',
  'Not identified from the name': 'Ad boyunca belgilenmedi',
  'Names without enough clues to identify a legal form': 'Huquqiy şeklini belgilemek içün yeterli alâmetleri olmağan adlar',
};

// Назви областей для crh (латинка), ключі — id областей у реєстрі.
export const REGIONS_CRH: Record<string, string> = {
  cherkasy: 'Çerkası', chernihiv: 'Çernihiv', chernivtsi: 'Çernivtsi', crimea: 'Qırım Muhtar Cumhuriyeti',
  dnipropetrovsk: 'Dnipropetrovsk', donetsk: 'Donetsk', 'ivano-frankivsk': 'İvano-Frankivsk', kharkiv: 'Harkiv',
  kherson: 'Herson', khmelnytskyi: 'Hmelnıtskıy', kirovohrad: 'Kirovohrad', kyiv: 'Kiev vilâyeti', 'kyiv-city': 'Kiev',
  luhansk: 'Luhansk', lviv: 'Lviv', mykolaiv: 'Mıkolayiv', odessa: 'Odesa', poltava: 'Poltava', rivne: 'Rivne',
  sumy: 'Sumı', ternopil: 'Ternopil', vinnytsia: 'Vinnıtsâ', volyn: 'Volın', zakarpattia: 'Zakarpatiye',
  zaporizhia: 'Zaporijiye', zhytomyr: 'Jıtomır', sevastopol: 'Aqyar (Sevastopol)', unknown: 'Kösterilmegen',
};

export function makeTr(locale: Locale) {
  return (uk: string, en: string) => (locale === 'en' ? en : locale === 'crh' ? CRH[en] ?? uk : uk);
}

// Адреси сусідніх сайтів мережі ПроМедіа; сайти без crh-версії
// (promedia.report) отримують українську адресу.
export const NETWORK_URLS: Record<'home' | 'news' | 'communities' | 'ratings' | 'research', Record<Locale, string>> = {
  home: { uk: 'https://promedia.report', en: 'https://promedia.report/en', crh: 'https://promedia.report' },
  news: { uk: 'https://news.promedia.report/', en: 'https://news.promedia.report/en/', crh: 'https://news.promedia.report/crh/' },
  communities: { uk: 'https://communities.promedia.report/', en: 'https://communities.promedia.report/en/', crh: 'https://communities.promedia.report/crh/' },
  ratings: { uk: 'https://ratings.promedia.report/', en: 'https://ratings.promedia.report/en/', crh: 'https://ratings.promedia.report/crh/' },
  research: { uk: 'https://research.promedia.report/', en: 'https://research.promedia.report/en/', crh: 'https://research.promedia.report/crh/' },
};

// У типах метаданих Next немає коду мови crh, тому hreflang для нього
// додаємо через spread, без перевірки зайвих полів.
export const crhAlternate = (href: string): object => ({ crh: href });
