import Atlas from '../atlas';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://atlas.promedia.report/en/' },
};

export default function EnglishHome(){return <Atlas locale="en"/>}
