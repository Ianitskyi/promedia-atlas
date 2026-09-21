import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './atlas.css';
import './profiles.css';
const title = 'Атлас Медіа — ПроМедіа';
const description = 'Карта зареєстрованих медіа України. Пошук, регіони, особи або компанії, на які оформлено медіа, та правила реєстрації.';
export const metadata: Metadata = { title, description, icons: { icon: '/favicon.png' }, alternates:{languages:{uk:'https://atlas.promedia.report/',en:'https://atlas.promedia.report/en'}}, openGraph:{type:'website',siteName:'ПроМедіа',url:'https://atlas.promedia.report/',title,description,images:[{url:'https://atlas.promedia.report/img/og-share.png',width:1200,height:630}]}, twitter:{card:'summary_large_image',title,description,images:['https://atlas.promedia.report/img/og-share.png']} };
const analyticsId = 'G-D8TM22QR9R';
export default function RootLayout({children}: {children: React.ReactNode}) {return <html lang="uk"><body>{children}<Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analyticsId}');`}</Script><Script src="/js/promedia-memorial-popup.js" strategy="afterInteractive" data-promedia-memorial="true"/></body></html>}
