import Atlas from '../atlas';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://atlas.promedia.report/en/',
    languages: {
      uk: 'https://atlas.promedia.report/',
      en: 'https://atlas.promedia.report/en/',
      'x-default': 'https://atlas.promedia.report/',
    },
  },
};

export default function EnglishHome(){return <Atlas locale="en"/>}
