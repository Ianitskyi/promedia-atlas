'use client';

export default function UtilityNav({locale,view,onView,profile=false,mediaId,path}:{locale:'uk'|'en';view?:string;onView?:(v:string)=>void;profile?:boolean;mediaId?:string;path?:string}){
 const en=locale==='en';
 const home=en?'https://promedia.report/en':'https://promedia.report';
 const ukPath=path||(mediaId?'/media/'+mediaId:'/');
 const enPath='/en'+(path||(mediaId?'/media/'+mediaId:''));
 return <div className="utility-bar">
  <a className="home-btn" href={home}>{en?'← ProMedia':'← ПроМедіа'}</a>
  {profile?<a className="nav-link" href={en?'/en':'/'}>{en?'Map and directory':'Карта й каталог'}</a>:<>
   <button className={'nav-link '+(view==='atlas'?'active':'')} onClick={()=>onView?.('atlas')}>{en?'Map and directory':'Карта й каталог'}</button>
   <a className="nav-link" href={(en?'/en':'')+'/analytics'}>{en?'Analytics':'Аналітика'}</a>
   <button className={'nav-link '+(view==='guide'?'active':'')} onClick={()=>onView?.('guide')}>{en?'How to register media':'Як зареєструвати медіа'}</button>
  </>}
  <a className="nav-link" href={'https://news.promedia.report/'+(en?'?lang=en':'')}>{en?'News':'Новини'}</a>
  <div className="lang-toggle" role="group" aria-label="Language / Мова">
   <a className={'lang-btn '+(!en?'active':'')} href={ukPath}>UA</a><a className={'lang-btn '+(en?'active':'')} href={enPath}>EN</a>
  </div>
 </div>
}
