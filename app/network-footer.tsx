import type { ReactNode } from 'react';

export default function NetworkFooter({ locale, children }: { locale: 'uk' | 'en'; children?: ReactNode }) {
  const en = locale === 'en';
  return <footer className="atlas-footer">
    {children && <div className="atlas-footer__details">{children}</div>}
    <nav className="network-footer" aria-label={en ? 'ProMedia projects' : 'Проєкти ПроМедіа'}>
      <a href={'https://news.promedia.report/' + (en ? '?lang=en' : '')}>{en ? 'News' : 'Новини'}</a>
      <a href={'https://communities.promedia.report/' + (en ? 'en/' : '')}>{en ? 'Community Map' : 'Карта спільнот'}</a>
      <a href={'https://ratings.promedia.report/' + (en ? '?lang=en' : '')}>{en ? 'Journalism Schools Ranking' : 'Рейтинг журфаків'}</a>
      <a href={'https://research.promedia.report/' + (en ? 'en/' : '')}>{en ? 'Research' : 'Дослідження'}</a>
      <a href={en ? '/en/' : '/'}>{en ? 'Media Atlas' : 'Атлас Медіа'}</a>
    </nav>
  </footer>;
}
