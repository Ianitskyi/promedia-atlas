// Переклад даних реєстру Нацради для англійської та кримськотатарської версій.
// Реєстр містить тисячі унікальних рядків, тому перекладаємо системно:
//  1) словник відомих фраз (юридичні форми, адміністративні слова в усіх
//     відмінках, області, технології, країни, мови, примітки);
//  2) прикметники-назви зводимо до називного відмінка («Бориспільського» →
//     «Бориспільський»), щоб транслітерація читалася як назва;
//  3) решту кирилиці транслітеруємо: для en — офіційна українська
//     транслітерація (КМУ 2010), для crh — кримськотатарська латиниця.
// Для uk усі функції повертають рядок без змін.
import type { Locale } from './i18n';

type Pair = { en: string; crh: string };
type Dict = [string, Pair][];

const p = (en: string, crh: string = en): Pair => ({ en, crh });

/* ---------- транслітерація ---------- */

const EN_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie', ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'i', й: 'i',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'shch', ь: '', ю: 'iu', я: 'ia', ы: 'y', э: 'e', ъ: '', ё: 'io',
};
const EN_INITIAL: Record<string, string> = { є: 'ye', ї: 'yi', й: 'y', ю: 'yu', я: 'ya' };
const CRH_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'j', з: 'z', и: 'ı', і: 'i', ї: 'yi', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ç',
  ш: 'ş', щ: 'şç', ь: '', ю: 'yu', я: 'ya', ы: 'ı', э: 'e', ъ: '', ё: 'yo',
};
const CYR_WORD = /[А-ЩЬЮЯҐЄІЇЫЭЪЁа-щьюяґєіїыэъё][А-ЩЬЮЯҐЄІЇЫЭЪЁа-щьюяґєіїыэъё'’ʼ]*/g;

function upper(s: string, l: 'en' | 'crh') {
  return l === 'crh' ? s.toLocaleUpperCase('tr') : s.toUpperCase();
}

function translitWord(word: string, l: 'en' | 'crh') {
  const lower = word.toLowerCase().replace(/['’ʼ]/g, '');
  const map = l === 'en' ? EN_MAP : CRH_MAP;
  let out = '';
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    if (l === 'en' && ch === 'з' && lower[i + 1] === 'г') { out += 'zgh'; i++; continue; }
    if (l === 'en' && i === 0 && EN_INITIAL[ch]) { out += EN_INITIAL[ch]; continue; }
    out += map[ch] ?? ch;
  }
  if (!out) return out;
  const allCaps = word.length > 1 && word === word.toUpperCase() && word !== word.toLowerCase();
  if (allCaps) return upper(out, l);
  if (word[0] !== word[0].toLowerCase()) return upper(out[0], l) + out.slice(1);
  return out;
}

export function translit(s: string, l: 'en' | 'crh') {
  return String(s || '').replace(CYR_WORD, (w) => translitWord(w, l));
}

/* ---------- прикметники-назви → називний відмінок ---------- */

function nominativeAdj(word: string) {
  return word
    .replace(/(ськ|цьк|зьк)(ого|ому|ім)$/i, (_m, a: string, e: string) => a + (e === e.toUpperCase() ? 'ИЙ' : 'ий'))
    .replace(/(ськ|цьк|зьк)(ої|ій|ою)$/i, (_m, a: string, e: string) => a + (e === e.toUpperCase() ? 'А' : 'а'))
    .replace(/(ськ|цьк|зьк)(их|ими)$/i, (_m, a: string, e: string) => a + (e === e.toUpperCase() ? 'І' : 'і'));
}

/* ---------- словники ---------- */

// Області: [прикметник у називному відмінку жіночого роду, en, crh]
const OBLASTS: [string, string, string][] = [
  ['Черкаська', 'Cherkasy', 'Çerkası'], ['Чернігівська', 'Chernihiv', 'Çernihiv'], ['Чернівецька', 'Chernivtsi', 'Çernivtsi'],
  ['Дніпропетровська', 'Dnipropetrovsk', 'Dnipropetrovsk'], ['Донецька', 'Donetsk', 'Donetsk'],
  ['Івано-Франківська', 'Ivano-Frankivsk', 'İvano-Frankivsk'], ['Харківська', 'Kharkiv', 'Harkiv'], ['Херсонська', 'Kherson', 'Herson'],
  ['Хмельницька', 'Khmelnytskyi', 'Hmelnıtskıy'], ['Кіровоградська', 'Kirovohrad', 'Kirovohrad'], ['Київська', 'Kyiv', 'Kiev'],
  ['Луганська', 'Luhansk', 'Luhansk'], ['Львівська', 'Lviv', 'Lviv'], ['Миколаївська', 'Mykolaiv', 'Mıkolayiv'], ['Одеська', 'Odesa', 'Odesa'],
  ['Полтавська', 'Poltava', 'Poltava'], ['Рівненська', 'Rivne', 'Rivne'], ['Сумська', 'Sumy', 'Sumı'], ['Тернопільська', 'Ternopil', 'Ternopil'],
  ['Вінницька', 'Vinnytsia', 'Vinnıtsâ'], ['Волинська', 'Volyn', 'Volın'], ['Закарпатська', 'Zakarpattia', 'Zakarpatiye'],
  ['Запорізька', 'Zaporizhzhia', 'Zaporijiye'], ['Житомирська', 'Zhytomyr', 'Jıtomır'],
];

function oblastPhrases(): Dict {
  const out: Dict = [];
  for (const [adj, en, crh] of OBLASTS) {
    const stem = adj.slice(0, -1);
    for (const form of [adj, stem + 'ої', stem + 'ій', stem + 'ою']) {
      for (const noun of ['області', 'область', 'обл.', 'обл']) out.push([`${form} ${noun}`, p(`${en} Oblast`, `${crh} vilâyeti`)]);
      out.push([form, p(en, crh)]);
    }
  }
  return out;
}

// Місто Київ і Крим: власні назви, де офіційна/кримськотатарська форма
// відрізняється від простої транслітерації.
const PLACES: Dict = [
  ['Київ', p('Kyiv', 'Kiev')], ['Києва', p('Kyiv', 'Kiev')], ['Києві', p('Kyiv', 'Kiev')],
  ['Україна', p('Ukraine', 'Ukraina')], ['України', p('Ukraine', 'Ukraina')], ['Україні', p('Ukraine', 'Ukraina')],
  ['Автономна Республіка Крим', p('Autonomous Republic of Crimea', 'Qırım Muhtar Cumhuriyeti')],
  ['Автономної Республіки Крим', p('Autonomous Republic of Crimea', 'Qırım Muhtar Cumhuriyeti')],
  ['АР Крим', p('Autonomous Republic of Crimea', 'Qırım Muhtar Cumhuriyeti')], ['Крим', p('Crimea', 'Qırım')], ['Криму', p('Crimea', 'Qırım')],
  ['Сімферополь', p('Simferopol', 'Aqmescit')], ['Бахчисарай', p('Bakhchysarai', 'Bağçasaray')], ['Джанкой', p('Dzhankoi', 'Canköy')],
  ['Алушта', p('Alushta', 'Aluşta')], ['Феодосія', p('Feodosiia', 'Kefe')], ['Керч', p('Kerch', 'Keriç')], ['Євпаторія', p('Yevpatoriia', 'Kezlev')],
  ['Севастополь', p('Sevastopol', 'Aqyar')], ['Судак', p('Sudak', 'Sudaq')], ['Саки', p('Saky', 'Saq')], ['Армянськ', p('Armiansk', 'Ermeni Bazar')],
  ['Білогірськ', p('Bilohirsk', 'Qarasuvbazar')], ['Старий Крим', p('Staryi Krym', 'Eski Qırım')], ['Красногвардійське', p('Krasnohvardiiske', 'Qurman')],
];

const LEGAL: Dict = [
  ['ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ', p('Limited Liability Company', 'Mesüliyeti sıñırlı şirket')],
  ['ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЬЮ', p('Limited Liability Company', 'Mesüliyeti sıñırlı şirket')],
  ['ТОВАРИСТВО З ДОДАТКОВОЮ ВІДПОВІДАЛЬНІСТЮ', p('Additional Liability Company', 'Ilâve mesüliyetli şirket')],
  ['ФІЗИЧНА ОСОБА-ПІДПРИЄМЕЦЬ', p('Sole Proprietor', 'Ferdiy işbilirmen')], ['ФІЗИЧНА ОСОБА ПІДПРИЄМЕЦЬ', p('Sole Proprietor', 'Ferdiy işbilirmen')],
  ['ФІЗИЧНА ОСОБА – ПІДПРИЄМЕЦЬ', p('Sole Proprietor', 'Ferdiy işbilirmen')], ['ФОП', p('Sole Proprietor', 'Ferdiy işbilirmen')],
  ['ПРИВАТНЕ АКЦІОНЕРНЕ ТОВАРИСТВО', p('Private Joint-Stock Company', 'Hususiy aksioner şirket')],
  ['ПУБЛІЧНЕ АКЦІОНЕРНЕ ТОВАРИСТВО', p('Public Joint-Stock Company', 'Umumiy aksioner şirket')],
  ['АКЦІОНЕРНЕ ТОВАРИСТВО', p('Joint-Stock Company', 'Aksioner şirket')],
  ['МАЛЕ ПРИВАТНЕ ПІДПРИЄМСТВО', p('Small Private Enterprise', 'Kiçik hususiy müessise')],
  ['ПРИВАТНЕ МАЛЕ ПІДПРИЄМСТВО', p('Small Private Enterprise', 'Kiçik hususiy müessise')],
  ['ПРИВАТНЕ ПІДПРИЄМСТВО', p('Private Enterprise', 'Hususiy müessise')],
  ['КОМУНАЛЬНЕ НЕКОМЕРЦІЙНЕ ПІДПРИЄМСТВО', p('Municipal Non-Profit Enterprise', 'Belediye ticariy olmağan müessisesi')],
  ['КОМУНАЛЬНЕ ПІДПРИЄМСТВО', p('Municipal Enterprise', 'Belediye müessisesi')],
  ['ДЕРЖАВНЕ НЕКОМЕРЦІЙНЕ ПІДПРИЄМСТВО', p('State Non-Profit Enterprise', 'Devlet ticariy olmağan müessisesi')],
  ['ДЕРЖАВНЕ ПІДПРИЄМСТВО', p('State Enterprise', 'Devlet müessisesi')], ['ДОЧІРНЄ ПІДПРИЄМСТВО', p('Subsidiary Enterprise', 'Qız müessise')],
  ['КОЛЕКТИВНЕ ПІДПРИЄМСТВО', p('Collective Enterprise', 'Kollektiv müessise')],
  ['ПІДПРИЄМСТВО ОБ\'ЄДНАННЯ ГРОМАДЯН', p('Enterprise of a Citizens’ Association', 'Vatandaşlar birliginiñ müessisesi')],
  ['ВСЕУКРАЇНСЬКА ГРОМАДСЬКА ОРГАНІЗАЦІЯ', p('All-Ukrainian NGO', 'Umumukrain içtimaiy teşkilâtı')],
  ['МІЖНАРОДНА ГРОМАДСЬКА ОРГАНІЗАЦІЯ', p('International NGO', 'Halqara içtimaiy teşkilât')],
  ['ГРОМАДСЬКА ОРГАНІЗАЦІЯ', p('NGO', 'İçtimaiy teşkilât')], ['ГРОМАДСЬКА СПІЛКА', p('Civic Union', 'İçtimaiy birlik')],
  ['БЛАГОДІЙНА ОРГАНІЗАЦІЯ', p('Charitable Organization', 'Hayriye teşkilâtı')],
  ['МІЖНАРОДНИЙ БЛАГОДІЙНИЙ ФОНД', p('International Charitable Foundation', 'Halqara hayriye fondu')],
  ['БЛАГОДІЙНИЙ ФОНД', p('Charitable Foundation', 'Hayriye fondu')],
  ['РЕЛІГІЙНА ОРГАНІЗАЦІЯ', p('Religious Organization', 'Diniy teşkilât')], ['ПОЛІТИЧНА ПАРТІЯ', p('Political Party', 'Siyasiy fırqa')],
  ['ДЕРЖАВНА НАУКОВА УСТАНОВА', p('State Research Institution', 'Devlet ilmiy müessisesi')],
  ['ПРИВАТНА НАУКОВА УСТАНОВА', p('Private Research Institution', 'Hususiy ilmiy müessise')],
  ['НАУКОВА УСТАНОВА', p('Research Institution', 'İlmiy müessise')],
  ['ДЕРЖАВНА УСТАНОВА', p('State Institution', 'Devlet müessisesi')], ['КОМУНАЛЬНА УСТАНОВА', p('Municipal Institution', 'Belediye müessisesi')],
  ['ПРИВАТНА УСТАНОВА', p('Private Institution', 'Hususiy müessise')], ['КОМУНАЛЬНА ОРГАНІЗАЦІЯ', p('Municipal Organization', 'Belediye teşkilâtı')],
  ['КОМУНАЛЬНИЙ ЗАКЛАД ВИЩОЇ ОСВІТИ', p('Municipal Higher Education Institution', 'Belediye ali tasil müessisesi')],
  ['ПРИВАТНИЙ ЗАКЛАД ВИЩОЇ ОСВІТИ', p('Private Higher Education Institution', 'Hususiy ali tasil müessisesi')],
  ['ЗАКЛАД ВИЩОЇ ОСВІТИ', p('Higher Education Institution', 'Ali tasil müessisesi')],
  ['ДЕРЖАВНИЙ ВИЩИЙ НАВЧАЛЬНИЙ ЗАКЛАД', p('State Higher Education Institution', 'Devlet ali oquv yurtu')],
  ['ПРИВАТНИЙ ВИЩИЙ НАВЧАЛЬНИЙ ЗАКЛАД', p('Private Higher Education Institution', 'Hususiy ali oquv yurtu')],
  ['ВИЩИЙ НАВЧАЛЬНИЙ ЗАКЛАД', p('Higher Education Institution', 'Ali oquv yurtu')],
  ['КОМУНАЛЬНИЙ ЗАКЛАД', p('Municipal Institution', 'Belediye müessisesi')], ['ДЕРЖАВНИЙ ЗАКЛАД', p('State Institution', 'Devlet müessisesi')],
  ['НАЦІОНАЛЬНИЙ НАУКОВИЙ ЦЕНТР', p('National Research Center', 'Milliy ilmiy merkez')],
  ['РЕДАКЦІЯ ОБЛАСНОЇ ГАЗЕТИ', p('Editorial Office of the Regional Newspaper', 'Vilâyet gazetasınıñ redaktsiyası')],
  ['РЕДАКЦІЯ ГАЗЕТИ', p('Newspaper Editorial Office', 'Gazeta redaktsiyası')],
  ['ТЕЛЕРАДІОКОМПАНІЯ КАБЕЛЬНОГО МОВЛЕННЯ', p('Cable Broadcasting Company', 'Kabel yayını şirketi')],
  ['ТЕЛЕРАДІООРГАНІЗАЦІЯ', p('Broadcasting Organization', 'Tele-radio teşkilâtı')], ['ТЕЛЕРАДІОКОМПАНІЯ', p('TV and Radio Company', 'Tele-radio şirketi')],
  ['ТЕЛЕКОМПАНІЯ', p('TV Company', 'Televideniye şirketi')], ['РАДІОКОМПАНІЯ', p('Radio Company', 'Radio şirketi')],
  ['ІНФОРМАЦІЙНЕ АГЕНТСТВО', p('News Agency', 'Haber agentligi')], ['РЕКЛАМНО-ІНФОРМАЦІЙНЕ АГЕНТСТВО', p('Advertising and Information Agency', 'Reklama-malümat agentligi')],
  ['ВИРОБНИЧО-КОМЕРЦІЙНА ФІРМА', p('Production and Commercial Firm', 'İstisal-ticariy firma')],
  ['ПРИВАТНА ФІРМА', p('Private Firm', 'Hususiy firma')], ['ТРК', p('TV and Radio Company', 'Tele-radio şirketi')], ['ТОВ', p('LLC', 'MMŞ')],
];

// Категорії реєстру — повні формулювання
const CATEGORIES: Dict = [
  ['Друковане медіа', p('Print media', 'Basma mediya')],
  ['Онлайн-медіа', p('Online media', 'Onlayn mediya')],
  ['Радіомовлення з використанням радіочастотного спектра', p('Radio broadcasting using radio-frequency spectrum', 'Radioçastota spektrini qullanğan radio yayını')],
  ['Провайдер аудіовізуальних сервісів', p('Audiovisual service provider', 'Audiovizual hızmetler provayderi')],
  ['Телевізійне мовлення з використанням радіочастотного спектра', p('Television broadcasting using radio-frequency spectrum', 'Radioçastota spektrini qullanğan televideniye yayını')],
  ['Лінійне телевізійне мовлення (аудіовізуальне лінійне мовлення)', p('Linear television broadcasting (audiovisual linear broadcasting)', 'Sızıqlı televideniye yayını (audiovizual sızıqlı yayın)')],
  ['Аудіовізуальне медіа на замовлення (нелінійний медіа-сервіс)', p('On-demand audiovisual media (non-linear media service)', 'Sımarış boyunca audiovizual mediya (sızıqsız mediya hızmeti)')],
  ['Лінійне радіомовлення (аудіальне лінійне мовлення)', p('Linear radio broadcasting (audio linear broadcasting)', 'Sızıqlı radio yayını (audio sızıqlı yayın)')],
  ['Іноземне лінійне медіа', p('Foreign linear media', 'Ecnebiy sızıqlı mediya')],
  ['Постачання електронних комунікаційних послуг для потреб мовлення', p('Electronic communications services for broadcasting', 'Yayın ihtiyacları içün elektron kommunikatsiya hızmetleri')],
  ['Провайдер платформи спільного доступу до відео', p('Video-sharing platform provider', 'Videoğa umumiy erişim platforması provayderi')],
  ['Аудіальне медіа на замовлення (нелінійний аудіомедіа-сервіс)', p('On-demand audio media (non-linear audio media service)', 'Sımarış boyunca audio mediya (sızıqsız audio mediya hızmeti)')],
  ['Лінійне телебачення без радіочастотного спектра', p('Linear television without radio-frequency spectrum', 'Radioçastota spektrisiz sızıqlı televideniye')],
  ['Лінійне радіо без радіочастотного спектра', p('Linear radio without radio-frequency spectrum', 'Radioçastota spektrisiz sızıqlı radio')],
];

// Фрази й слова для технологій, територій, адрес, приміток (усі відмінки).
const TEXT: Dict = [
  // технології / види медіа
  ['публічна сторінка в соціальній мережі', p('public page on the social network', 'içtimaiy şebekede açıq saife')],
  ['публічна сторінка у соціальній мережі', p('public page on the social network', 'içtimaiy şebekede açıq saife')],
  ['канал у відеохостингу', p('channel on the video hosting', 'video hostingde kanal')], ['канал відеохостингу в', p('video hosting channel on', 'video hosting kanalı')],
  ['канал у відеострімінгу', p('channel on the video streaming service', 'video striming hızmetinde kanal')],
  ['Канал у відеострiмінгу', p('Channel on the video streaming service', 'Video striming hızmetinde kanal')],
  ['канал у Telegram', p('Telegram channel', 'Telegram kanalı')], ['канал у месенджері', p('messenger channel', 'messencerde kanal')],
  ['Інтернет-мовлення', p('Internet broadcasting', 'İnternet yayını')], ['Інтернет-видання', p('Online publication', 'İnternet neşiri')],
  ['Збірник наукових праць', p('Collection of research papers', 'İlmiy işler toplamı')], ['Науковий збірник', p('Research collection', 'İlmiy toplam')],
  ['Науковий журнал', p('Research journal', 'İlmiy mecmua')], ['Науково-практичний журнал', p('Research and practice journal', 'İlmiy-ameliy mecmua')],
  ['Електронний науковий журнал', p('Electronic research journal', 'Elektron ilmiy mecmua')],
  ['Електронне наукове фахове видання', p('Electronic peer-reviewed scholarly publication', 'Elektron ilmiy ihtisas neşiri')],
  ['Науковий рецензований фаховий електронний журнал', p('Peer-reviewed scholarly electronic journal', 'Retsenziyalanğan ilmiy elektron mecmua')],
  ['вебсайт наукового журналу', p('research journal website', 'ilmiy mecmua saytı')],
  ['Кабельна аналогова', p('Analogue cable', 'Analog kabel')], ['кабельна цифрова', p('digital cable', 'sanal kabel')], ['Кабельна цифрова', p('Digital cable', 'Sanal kabel')],
  ['Супутникова', p('Satellite', 'Yoldaş')], ['Портал новин', p('News portal', 'Haber portalı')], ['Інформаційне агентство', p('News agency', 'Haber agentligi')],
  ['Інформаційний портал', p('Information portal', 'Malümat portalı')], ['Інформаційний сайт', p('Information website', 'Malümat saytı')],
  ['Інтернет', p('Internet', 'İnternet')], ['Вебсайт', p('Website', 'Sayt')], ['вебсайт', p('website', 'sayt')], ['Журнал', p('Magazine', 'Mecmua')], ['журнал', p('magazine', 'mecmua')],
  ['Газета', p('Newspaper', 'Gazeta')], ['газета', p('newspaper', 'gazeta')], ['Збірник', p('Collection', 'Toplam')], ['збірник', p('collection', 'toplam')],
  ['Бюлетень', p('Bulletin', 'Bülleten')], ['Календар', p('Calendar', 'Taqvim')], ['Альманах', p('Almanac', 'Almanah')], ['Вісник', p('Bulletin', 'Haberci')],
  ['поширення масової інформації', p('mass media distribution', 'kütleviy malümat yayılması')],
  ['Сторінка', p('Page', 'Saife')], ['сторінка', p('page', 'saife')], ['Фейсбук', p('Facebook', 'Facebook')], ['Інстаграм', p('Instagram', 'Instagram')],
  ['Ютуб', p('YouTube', 'YouTube')], ['Тікток', p('TikTok', 'TikTok')], ['Телеграм', p('Telegram', 'Telegram')], ['Х', p('X', 'X')],
  ['англ', p('English', 'ingliz')], ['рос', p('Russian', 'rus')], ['угорс', p('Hungarian', 'macar')],
  ['портал', p('portal', 'portal')], ['сайт', p('website', 'sayt')], ['програма', p('programme', 'programma')], ['МГц', p('MHz', 'MHz')], ['кГц', p('kHz', 'kHz')],
  ['МХ-', p('MX-', 'MX-')], ['ТВК', p('TV channel', 'TV kanal')], ['ОТТ', p('OTT', 'OTT')],
  ['Електронний журнал', p('Electronic magazine', 'Elektron mecmua')], ['Інтернет-сайт', p('Website', 'Sayt')],
  ['науковий', p('research', 'ilmiy')], ['наукове', p('research', 'ilmiy')], ['видання', p('publication', 'neşir')], ['електронне', p('electronic', 'elektron')],
  ['електронний', p('electronic', 'elektron')], ['інформаційний', p('information', 'malümat')], ['інформаційне', p('information', 'malümat')],
  ['періодичне', p('periodical', 'devriy')], ['онлайн-медіа', p('online media', 'onlayn mediya')], ['новин', p('news', 'haberler')], ['новини', p('news', 'haberler')],
  ['соціальній мережі', p('social network', 'içtimaiy şebeke')], ['публічна сторінка', p('public page', 'açıq saife')],

  // примітки до іноземних медіа та ліцензій
  ['Тимчасово призупинена ліцензія', p('Licence temporarily suspended', 'Litsenziya muvaqqat toqtatıldı')],
  ['Країна походження', p('Country of origin', 'Menşe memleketi')], ['Формат', p('Format', 'Format')], ['Мови', p('Languages', 'Tiller')],
  ['Сполучене Королівство Великої Британії та Північної Ірландії', p('United Kingdom of Great Britain and Northern Ireland', 'Büyük Britaniya ve Şimaliy İrlandiya Birleşken Qırallığı')],
  ['Великобританія', p('United Kingdom', 'Büyük Britaniya')], ['США', p('USA', 'AQŞ')], ['Гібралтар', p('Gibraltar', 'Cebelitarıq')],
  ['стиль життя', p('lifestyle', 'ayat tarzı')], ['загальної тематики', p('general interest', 'umumiy mevzu')], ['без діалогів', p('no dialogue', 'dialogsız')],
  ['музичний супровід', p('music', 'muzıka')], ['та ще', p('and', 've daa')],
  ['спортивний', p('sports', 'sport')], ['розважальний', p('entertainment', 'eglence')], ['музичний', p('music', 'muzıka')], ['Фільмовий', p('Film', 'Film')],
  ['документальний', p('documentary', 'hronikal')], ['релігійний', p('religious', 'diniy')], ['відпочинок', p('leisure', 'raatlıq')], ['здоров\'я', p('health', 'sağlıq')],
  ['здоров’я', p('health', 'sağlıq')], ['подорожі', p('travel', 'seyahat')], ['просвітницький', p('educational', 'aydınlatuv')], ['освітній', p('educational', 'tasil')],
  ['культурологічний', p('cultural', 'medeniy')], ['культурологійний', p('cultural', 'medeniy')], ['мов', p('languages', 'til')],
  ['англійська', p('English', 'ingliz')], ['російська', p('Russian', 'rus')], ['українська', p('Ukrainian', 'ukrain')], ['угорська', p('Hungarian', 'macar')],
  ['польська', p('Polish', 'leh')], ['Польська', p('Polish', 'leh')], ['іспанська', p('Spanish', 'ispan')], ['французька', p('French', 'frenk')],
  ['німецька', p('German', 'alman')], ['італійська', p('Italian', 'italyan')], ['турецька', p('Turkish', 'türk')], ['румунська', p('Romanian', 'rumın')],
  ['чеська', p('Czech', 'çeh')], ['словацька', p('Slovak', 'slovak')], ['болгарська', p('Bulgarian', 'bulgar')], ['естонська', p('Estonian', 'eston')],
  ['сербська', p('Serbian', 'serb')], ['словенська', p('Slovenian', 'sloven')], ['португальська', p('Portuguese', 'portugal')], ['хорватська', p('Croatian', 'hırvat')],
  ['латвійська', p('Latvian', 'latış')], ['латиська', p('Latvian', 'latış')], ['шведська', p('Swedish', 'şved')], ['норвезька', p('Norwegian', 'norveç')],
  ['грецька', p('Greek', 'yunan')], ['голландська', p('Dutch', 'golland')], ['датська', p('Danish', 'dan')], ['іврит', p('Hebrew', 'ibraniy')],

  // території мовлення та адреси
  ['поза межами державного кордону', p('outside the state border', 'devlet sıñırından tışta')],
  ['впевненого прийому сигналу супутника', p('reliable satellite signal reception', 'yoldaş sinyalini işançlı qabul etüv')],
  ['розташування багатоканальної телемережі', p('location of the multichannel TV network', 'çoq kanallı tele şebekeniñ yeri')],
  ['територія України', p('territory of Ukraine', 'Ukraina topraqları')], ['території України', p('territory of Ukraine', 'Ukraina topraqları')],
  ['територіальних громад', p('territorial communities', 'topraq cemaatleri')], ['територіальної громади', p('territorial community', 'topraq cemaati')],
  ['територіальна громада', p('territorial community', 'topraq cemaati')], ['територіальні громади', p('territorial communities', 'topraq cemaatleri')],
  ['прилеглі території', p('adjacent areas', 'yaqın topraqlar')], ['прилеглі райони', p('adjacent districts', 'yaqın rayonlar')], ['прилеглі', p('adjacent', 'yaqın')],
  ['в межах', p('within', 'sıñırlarında')], ['у межах', p('within', 'sıñırlarında')],
  ['території', p('territory', 'topraqları')], ['територія', p('territory', 'topraqları')], ['теріторія', p('territory', 'topraqları')],
  ['міськрада', p('city council', 'şeer şurası')], ['міськради', p('city council', 'şeer şurası')],
  ['міської', p('city', 'şeer')], ['міська', p('city', 'şeer')], ['міських', p('city', 'şeer')],
  ['селищної', p('settlement', 'qasaba')], ['селищна', p('settlement', 'qasaba')], ['селищних', p('settlement', 'qasaba')],
  ['сільської', p('village', 'köy')], ['сільська', p('village', 'köy')], ['сільських', p('village', 'köy')],
  ['громади', p('community', 'cemaati')], ['громад', p('communities', 'cemaatleri')], ['громада', p('community', 'cemaati')],
  ['районів', p('districts', 'rayonları')], ['райони', p('districts', 'rayonları')], ['району', p('district', 'rayonı')], ['районі', p('district', 'rayonı')], ['район', p('district', 'rayonı')],
  ['областей', p('oblasts', 'vilâyetleri')], ['області', p('Oblast', 'vilâyeti')], ['область', p('Oblast', 'vilâyeti')], ['обл.', p('Oblast', 'vilâyeti')],
  ['селище', p('settlement', 'qasaba')],
  ['м.', p('', '')], ['та', p('and', 've')], ['і', p('and', 've')], ['й', p('and', 've')],
  // у кримськотатарській прийменники стають післяйменниками — щоб не ламати
  // порядок слів, просто їх опускаємо.
  ['для', p('for', '')], ['у', p('in', '')], ['в', p('in', '')],
];

type Compiled = { re: RegExp; map: Map<string, Pair>; exact: Map<string, Pair> };

function compile(dict: Dict): Compiled {
  const sorted = [...dict].sort((a, b) => b[0].length - a[0].length);
  const map = new Map<string, Pair>();
  const exact = new Map<string, Pair>(sorted);
  for (const [k, v] of sorted) if (!map.has(k.toLowerCase())) map.set(k.toLowerCase(), v);
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const L = 'А-ЩЬЮЯҐЄІЇа-щьюяґєіїA-Za-z0-9';
  const re = new RegExp(`(?<![${L}])(?:${sorted.map(([k]) => esc(k)).join('|')})(?![${L}])`, 'gi');
  return { re, map, exact };
}

const C_LEGAL = compile(LEGAL);
const C_TEXT = compile([...oblastPhrases(), ...PLACES, ...TEXT]);
const CATEGORY_MAP = new Map(CATEGORIES.map(([k, v]) => [k, v]));

const SLOT = '\u0001';

// «с. Микуличі» → «Mykulychi village» / «Mıkulıçi köyü»: тип населеного
// пункту ставимо після назви, як у англійській і кримськотатарській.
const SETTLEMENT: Record<string, Pair> = {
  'с.': p('village', 'köyü'), 'с-ще': p('settlement', 'qasabası'), 'селище': p('settlement', 'qasabası'), 'смт': p('urban-type settlement', 'qasabası'),
};
const SETTLEMENT_RE = /(^|[\s,;(])(с\.|с-ще|селище|смт)\s*([А-ЩЬЮЯҐЄІЇ][а-щьюяґєії'’ʼ]*(?:-[А-ЩЬЮЯҐЄІЇа-щьюяґєії][а-щьюяґєії'’ʼ]*)*)/g;

function applyDict(s: string, c: Compiled, l: 'en' | 'crh', normalizeAdjectives: boolean) {
  const slots: string[] = [];
  s = s.replace(SETTLEMENT_RE, (_m, pre: string, kind: string, name: string) => {
    slots.push(SETTLEMENT[kind.toLowerCase()][l]);
    return pre + name + ' ' + SLOT + (slots.length - 1) + SLOT;
  });
  let out = s.replace(c.re, (m) => {
    // Спершу точний збіг (зберігає регістр: «Сторінка» / «сторінка»).
    const v = c.exact.get(m) ?? c.map.get(m.toLowerCase());
    if (!v) return m;
    slots.push(v[l]);
    return SLOT + (slots.length - 1) + SLOT;
  });
  if (normalizeAdjectives) out = out.replace(CYR_WORD, (w) => (w[0] !== w[0].toLowerCase() ? nominativeAdj(w) : w));
  out = translit(out, l);
  out = out.replace(new RegExp(SLOT + '(\\d+)' + SLOT, 'g'), (_m, i: string) => slots[Number(i)]);
  return out.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:)])/g, '$1').replace(/^[\s,]+/, '').trim();
}

const cache = new Map<string, string>();
function memo(kind: string, l: 'en' | 'crh', s: string, fn: () => string) {
  const key = kind + '\u0002' + l + '\u0002' + s;
  let v = cache.get(key);
  if (v === undefined) { v = fn(); if (cache.size > 50000) cache.clear(); cache.set(key, v); }
  return v;
}

export type RegistryL10n = {
  /** Назва медіа чи бренду — транслітерація. */
  media: (s: string) => string;
  /** Особа або компанія: юридична форма перекладається, назва транслітерується. */
  org: (s: string) => string;
  /** Населений пункт, адреса. */
  place: (s: string) => string;
  /** Технологія, територія, канал, частота, примітка. */
  text: (s: string) => string;
  /** Повна назва категорії реєстру. */
  category: (s: string) => string;
};

const identity = (s: string) => s;

// Юридичну форму перекладаємо лише поза лапками: у лапках — власна назва.
function orgName(s: string, l: 'en' | 'crh') {
  const q = s.search(/["«“]/);
  return q < 0 ? applyDict(s, C_LEGAL, l, false) : applyDict(s.slice(0, q), C_LEGAL, l, false) + ' ' + translit(s.slice(q), l);
}

export function registryL10n(locale: Locale): RegistryL10n {
  if (locale === 'uk') return { media: identity, org: identity, place: identity, text: identity, category: identity };
  const l = locale;
  return {
    // Назва бренду часто збігається з назвою юрособи («ТОВ "…"»), тому
    // медіа й організації обробляємо однаково.
    media: (s) => (s ? memo('o', l, s, () => orgName(s, l)) : s),
    org: (s) => (s ? memo('o', l, s, () => orgName(s, l)) : s),
    place: (s) => (s ? memo('p', l, s, () => applyDict(s, C_TEXT, l, true)) : s),
    text: (s) => (s ? memo('t', l, s, () => applyDict(s, C_TEXT, l, true)) : s),
    category: (s) => (s ? memo('c', l, s, () => CATEGORY_MAP.get(s)?.[l] ?? applyDict(s, C_TEXT, l, false)) : s),
  };
}

/** Латинська форма для пошуку: щоб «Suspilne» знаходило «Суспільне». */
export function searchLatin(s: string) {
  return translit(s, 'en').toLowerCase();
}
