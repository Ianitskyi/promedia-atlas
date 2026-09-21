import type {Metadata} from 'next';
const title='Media Atlas — ProMedia';
const description='Map and directory of registered media in Ukraine, with filters, analytics and registration guidance.';
export const metadata:Metadata={title,description,alternates:{languages:{uk:'https://atlas.promedia.report/',en:'https://atlas.promedia.report/en'}},openGraph:{type:'website',siteName:'ProMedia',url:'https://atlas.promedia.report/en',title,description,images:[{url:'https://atlas.promedia.report/img/og-share-en.png',width:1200,height:630}]},twitter:{card:'summary_large_image',title,description,images:['https://atlas.promedia.report/img/og-share-en.png']}};
export default function EnglishLayout({children}:{children:React.ReactNode}){return children}
