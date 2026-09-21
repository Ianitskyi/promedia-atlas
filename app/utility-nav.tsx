'use client';

export default function UtilityNav({locale,view,onView,profile=false,mediaId,path}:{locale:'uk'|'en';view?:string;onView?:(v:string)=>void;profile?:boolean;mediaId?:string;path?:string}){
 const en=locale==='en';
 const home=en?'https://promedia.report/en':'https://promedia.report';
 const ukPath=path||(mediaId?'/media/'+mediaId:'/');
 const enPath='/en'+(path||(mediaId?'/media/'+mediaId:''));
 return <>
  <nav className="utility-bar" aria-label={en ? 'Media Atlas navigation' : 'Навігація Атласу Медіа'}>
  <a className="home-btn" href={home}>{en?'← ProMedia':'← ПроМедіа'}</a>
  {profile?<a className="nav-link" href={en?'/en':'/'}>{en?'Map and directory':'Карта й каталог'}</a>:<>
   <button className={'nav-link '+(view==='atlas'?'active':'')} onClick={()=>onView?.('atlas')}>{en?'Map and directory':'Карта й каталог'}</button>
   <a className="nav-link" href={(en?'/en':'')+'/analytics'}>{en?'Analytics':'Аналітика'}</a>
   <button className={'nav-link '+(view==='guide'?'active':'')} onClick={()=>onView?.('guide')}>{en?'How to register media':'Як зареєструвати медіа'}</button>
  </>}
  <div className="lang-toggle" role="group" aria-label="Language / Мова">
   <a className={'lang-btn '+(!en?'active':'')} href={ukPath}>UA</a><a className={'lang-btn '+(en?'active':'')} href={enPath}>EN</a>
  </div>
  </nav>
  <nav className="network-nav" aria-label={en ? 'ProMedia projects' : 'Проєкти ПроМедіа'}>
   <span className="network-nav__label">{en ? 'ProMedia projects' : 'Проєкти ПроМедіа'}</span>
   <div className="network-nav__links">
    <a className="network-link" href={'https://news.promedia.report/'+(en?'?lang=en':'')}>{en?'News':'Новини'}</a>
    <a className="network-link" href={'https://communities.promedia.report/'+(en?'en/':'')}>{en?'Community Map':'Карта спільнот'}</a>
    <a className="network-link" href={'https://ratings.promedia.report/'+(en?'?lang=en':'')}>{en?'Journalism Schools Ranking':'Рейтинг журфаків'}</a>
    <a className="network-link" href={'https://research.promedia.report/'+(en?'en/':'')}>{en?'Research':'Дослідження'}</a>
    <a className="network-link active" href={en?'/en/':'/'}>{en?'Media Atlas':'Атлас Медіа'}</a>
   </div>
  </nav>
 </>
}
