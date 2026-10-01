'use client';
import {makeTr,NETWORK_URLS,prefix,type Locale} from '@/lib/i18n';

export default function UtilityNav({locale,view,onView,profile=false,mediaId,path}:{locale:Locale;view?:string;onView?:(v:string)=>void;profile?:boolean;mediaId?:string;path?:string}){
 const tr=makeTr(locale);
 const home=NETWORK_URLS.home[locale];
 const rest=path||(mediaId?'/media/'+mediaId:'');
 const langPath=(l:Locale)=>prefix(l)+rest||'/';
 return <>
  <nav className="utility-bar" aria-label={tr('Навігація Атласу Медіа','Media Atlas navigation')}>
  <a className="home-btn" href={home}>{tr('← ПроМедіа','← ProMedia')}</a>
  {profile?<a className="nav-link" href={prefix(locale)||'/'}>{tr('Карта й каталог','Map and directory')}</a>:<>
   <button className={'nav-link '+(view==='atlas'?'active':'')} onClick={()=>onView?.('atlas')}>{tr('Карта й каталог','Map and directory')}</button>
   <a className="nav-link" href={prefix(locale)+'/analytics'}>{tr('Аналітика','Analytics')}</a>
   <button className={'nav-link '+(view==='guide'?'active':'')} onClick={()=>onView?.('guide')}>{tr('Як зареєструвати медіа','How to register media')}</button>
  </>}
  <div className="lang-toggle" role="group" aria-label="Language / Мова">
   <a className={'lang-btn '+(locale==='uk'?'active':'')} href={langPath('uk')}>UA</a><a className={'lang-btn '+(locale==='en'?'active':'')} href={langPath('en')}>EN</a><a className={'lang-btn '+(locale==='crh'?'active':'')} href={langPath('crh')}>QT</a>
  </div>
  </nav>
  <nav className="network-nav" aria-label={tr('Проєкти ПроМедіа','ProMedia projects')}>
   <span className="network-nav__label">{tr('Проєкти ПроМедіа','ProMedia projects')}</span>
   <div className="network-nav__links">
    <a className="network-link" href={NETWORK_URLS.news[locale]}>{tr('Новини','News')}</a>
    <a className="network-link" href={NETWORK_URLS.communities[locale]}>{tr('Карта спільнот','Community Map')}</a>
    <a className="network-link" href={NETWORK_URLS.ratings[locale]}>{tr('Рейтинг журфаків','Journalism Schools Ranking')}</a>
    <a className="network-link" href={NETWORK_URLS.research[locale]}>{tr('Дослідження','Research')}</a>
    <a className="network-link active" href={prefix(locale)+'/'}>{tr('Атлас Медіа','Media Atlas')}</a>
   </div>
  </nav>
 </>
}
