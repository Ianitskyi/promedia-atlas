import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './atlas.css';
import './profiles.css';
export const metadata: Metadata = { title: 'Атлас Меда — ПроМедіа', description: 'Карта зареєстрованих медіа України. Пошук, регіони, реєстранти та правила реєстрації.' };
const analyticsId = 'G-D8TM22QR9R';
export default function RootLayout({children}: {children: React.ReactNode}) {return <html lang="uk"><body>{children}<Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analyticsId}');`}</Script></body></html>}
