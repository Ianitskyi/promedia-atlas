import type { ReactNode } from 'react';
import { makeTr, NETWORK_URLS, prefix, type Locale } from '@/lib/i18n';

export default function NetworkFooter({ locale, children }: { locale: Locale; children?: ReactNode }) {
  const tr = makeTr(locale);
  return <footer className="atlas-footer">
    {children && <div className="atlas-footer__details">{children}</div>}
    <nav className="network-footer" aria-label={tr('Проєкти ПроМедіа', 'ProMedia projects')}>
      <a href={NETWORK_URLS.news[locale]}>{tr('Новини', 'News')}</a>
      <a href={NETWORK_URLS.communities[locale]}>{tr('Карта спільнот', 'Community Map')}</a>
      <a href={NETWORK_URLS.ratings[locale]}>{tr('Рейтинг журфаків', 'Journalism Schools Ranking')}</a>
      <a href={NETWORK_URLS.research[locale]}>{tr('Дослідження', 'Research')}</a>
      <a href={prefix(locale) + '/'}>{tr('Атлас Медіа', 'Media Atlas')}</a>
    </nav>
  </footer>;
}
