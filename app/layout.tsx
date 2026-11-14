import type { Metadata } from 'next';
import { crhAlternate } from '@/lib/i18n';
import { headers } from 'next/headers';
import Script from 'next/script';
import { createElement } from 'react';
import './globals.css';
import './atlas.css';
import './profiles.css';
const title = 'Атлас Медіа — ПроМедіа';
const description = 'Карта зареєстрованих медіа України. Пошук, регіони, особи або компанії, на які оформлено медіа, та правила реєстрації.';
export const metadata: Metadata = { title, description, icons: { icon: '/favicon.png' }, alternates:{languages:{uk:'https://atlas.promedia.report/',en:'https://atlas.promedia.report/en',...crhAlternate('https://atlas.promedia.report/crh')}}, openGraph:{type:'website',siteName:'ПроМедіа',url:'https://atlas.promedia.report/',title,description,images:[{url:'https://atlas.promedia.report/img/og-share.png',width:1200,height:630}]}, twitter:{card:'summary_large_image',title,description,images:['https://atlas.promedia.report/img/og-share.png']} };
export default async function RootLayout({children}: {children: React.ReactNode}) {
  const header = (await headers()).get('x-promedia-locale');
  const locale = header === 'en' || header === 'crh' ? header : 'uk';
  return <html lang={locale}><body>{createElement('promedia-global-header')}{children}{createElement('promedia-global-footer')}<Script src="https://news.promedia.report/js/promedia-global-shell.js" strategy="afterInteractive"/><Script src="https://news.promedia.report/js/promedia-analytics.js" strategy="afterInteractive"/><Script src="/js/promedia-memorial-popup.js" strategy="afterInteractive" data-promedia-memorial="true"/></body></html>
}
