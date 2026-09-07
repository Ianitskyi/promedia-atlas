import type { Metadata } from 'next';
import './globals.css';
import './atlas.css';
export const metadata: Metadata = { title: 'Медіаатлас України — ПроМедіа', description: 'Карта зареєстрованих медіа України. Пошук, регіони, реєстранти та правила реєстрації.' };
export default function RootLayout({children}: {children: React.ReactNode}) {return <html lang="uk"><body>{children}</body></html>}
