import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';

export default function NetworkFooter({ locale, children }: { locale: Locale; children?: ReactNode }) {
  return children ? <div className="atlas-footer atlas-project-footer"><div className="atlas-footer__details">{children}</div></div> : null;
}