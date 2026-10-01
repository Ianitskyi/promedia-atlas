import type {Metadata} from 'next';
import {crhAlternate} from '@/lib/i18n';
const title='Mediya Atlası — ProMedia';
const description='Ukrainada qayd etilgen mediyalarnıñ haritası ve katalogı: süzgüçler, analitika ve qayd aqqında qılavuz.';
export const metadata:Metadata={title,description,alternates:{languages:{uk:'https://atlas.promedia.report/',en:'https://atlas.promedia.report/en',...crhAlternate('https://atlas.promedia.report/crh')}},openGraph:{type:'website',siteName:'ProMedia',url:'https://atlas.promedia.report/crh',title,description,locale:'crh_UA',images:[{url:'https://atlas.promedia.report/img/og-share.png',width:1200,height:630}]},twitter:{card:'summary_large_image',title,description,images:['https://atlas.promedia.report/img/og-share.png']}};
export default function CrimeanTatarLayout({children}:{children:React.ReactNode}){return children}
