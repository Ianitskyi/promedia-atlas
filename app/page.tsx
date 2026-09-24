import Atlas from './atlas';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://atlas.promedia.report/' },
};

export default function Home() { return <Atlas locale="uk"/>; }
