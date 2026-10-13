// Static regression check for Crimean Tatar UI translations.
// Checks simple tr('uk', 'en'), T(locale, 'uk', 'en'), and source arrays
// used through T(locale, row.uk, row.en) / T(locale, topic[n], ...).
// It is not a parser, browser test, or linguistic quality assessment.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const translationSource = read('lib/i18n.ts');
const start = translationSource.indexOf('export const CRH:');
const end = translationSource.indexOf('\n};', start);
if (start < 0 || end < 0) throw new Error('Could not find the CRH dictionary');
const dictionary = translationSource.slice(start, end);
const translations = new Set(
  [...dictionary.matchAll(/^\s*(['"])((?:\\.|(?!\1)[\s\S])*?)\1\s*:/gm)]
    .map((match) => match[2])
);

const sources = [
  'app/atlas.tsx',
  'app/analytics/analytics-content.tsx',
  'app/media/[id]/profile.tsx',
  'app/utility-nav.tsx',
  'app/registry-history.tsx',
];

const keys = [];
const q = "'(?:\\\\.|[^'\\\\])*'";
const callPattern = new RegExp(
  '\\b(?:tr|T)\\(\\s*(?:locale\\s*,\\s*)?(' + q + ')\\s*,\\s*(' + q + ')',
  'g'
);
for (const file of sources) {
  for (const match of read(file).matchAll(callPattern)) {
    keys.push({ file, key: match[2].slice(1, -1) });
  }
}

const analytics = read('app/analytics/analytics-content.tsx');
function between(text, from, until) {
  const startIndex = text.indexOf(from);
  const endIndex = text.indexOf(until, startIndex);
  if (startIndex < 0 || endIndex < 0) throw new Error('Missing section: ' + from);
  return text.slice(startIndex, endIndex);
}
const topics = between(analytics, 'const topics=', ' as const;');
let topicCount = 0;
for (const match of topics.matchAll(/\[\s*'[^']+'\s*,\s*'[^']+'\s*,\s*'([^']+)'\s*,\s*'[^']+'\s*,\s*'([^']+)'/g)) {
  topicCount++;
  keys.push({ file: 'topics.title', key: match[1] });
  keys.push({ file: 'topics.description', key: match[2] });
}
const legalForms = between(analytics, 'const legalForms:', '];');
let legalCount = 0;
for (const match of legalForms.matchAll(/(?:^|[,{\s])(?:en|hintEn)\s*:\s*'([^']+)'/g)) {
  legalCount++;
  keys.push({ file: 'legalForms', key: match[1] });
}

if (topicCount !== 7 || legalCount !== 36) {
  throw new Error(
    'Coverage extractor needs review: expected 7 topics / 36 legal-form strings, got ' +
      topicCount + ' / ' + legalCount
  );
}
const missing = keys.filter(({ key }) => !translations.has(key));
console.log('CRH dictionary entries:', translations.size);
console.log('Static and array-backed UI strings checked:', keys.length);
console.log('Missing CRH translations:', missing.length);
for (const { file, key } of missing) console.error(file + ': ' + key);
if (missing.length) process.exitCode = 1;
