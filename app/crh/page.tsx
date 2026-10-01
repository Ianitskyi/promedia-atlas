import Atlas from '../atlas';
import type { Metadata } from 'next';
import { crhAlternate } from '@/lib/i18n';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://atlas.promedia.report/crh/',
    languages: {
      uk: 'https://atlas.promedia.report/',
      en: 'https://atlas.promedia.report/en/',
      ...crhAlternate('https://atlas.promedia.report/crh/'),
      'x-default': 'https://atlas.promedia.report/',
    },
  },
};

export default function CrimeanTatarHome(){return <Atlas locale="crh"/>}
