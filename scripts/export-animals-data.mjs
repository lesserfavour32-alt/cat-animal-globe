import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ANIMALS } from '../src/data/animals.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../public/data/animals-by-category.json');

const byCategory = {
  cat: ANIMALS.filter((a) => a.category === 'cat'),
  dog: ANIMALS.filter((a) => a.category === 'dog'),
  wildlife: ANIMALS.filter((a) => a.category === 'wildlife'),
};

const payload = {
  generatedAt: new Date().toISOString(),
  total: ANIMALS.length,
  counts: {
    cat: byCategory.cat.length,
    dog: byCategory.dog.length,
    wildlife: byCategory.wildlife.length,
  },
  data: byCategory,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
console.log(`Exported categorized data to: ${outPath}`);
