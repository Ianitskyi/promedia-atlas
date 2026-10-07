'use client';
import {makeTr,prefix,type Locale} from '@/lib/i18n';

export default function UtilityNav({locale,view,onView,profile=false,mediaId,path}:{locale:Locale;view?:string;onView?:(v:string)=>void;profile?:boolean;mediaId?:string;path?:string}){
 const tr=makeTr(locale);
 return <nav className="utility-bar atlas-local-nav" aria-label={tr('Навігація Атласу Медіа','Media Atlas navigation')}>
  {profile?<a className="nav-link" href={prefix(locale)||'/'}>{tr('Карта й каталог','Map and directory')}</a>:<>
   <button className={'nav-link '+(view==='atlas'?'active':'')} onClick={()=>onView?.('atlas')}>{tr('Карта й каталог','Map and directory')}</button>
   <a className="nav-link" href={prefix(locale)+'/analytics'}>{tr('Аналітика','Analytics')}</a>
   <button className={'nav-link '+(view==='guide'?'active':'')} onClick={()=>onView?.('guide')}>{tr('Як зареєструвати медіа','How to register media')}</button>
  </>}
 </nav>
}