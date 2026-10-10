// Converte as fotos grandes do Figma (.assets/figma/**) para WebP otimizado.
// Originais vão para .assets/figma/_originals (ignorado pelo git).
import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import sharp from 'sharp';

const ROOT = join(process.cwd(), '.assets', 'figma');
const ORIGINALS = join(ROOT, '_originals');
const THRESHOLD = 150 * 1024; // só PNGs acima de 150 KB
const MAX_WIDTH = 1800;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

await mkdir(ORIGINALS, { recursive: true });
for (const file of await walk(ROOT)) {
  if (extname(file).toLowerCase() !== '.png') continue;
  const { size } = await stat(file);
  if (size < THRESHOLD) continue;
  const dest = join(dirname(file), basename(file, '.png') + '.webp');
  await sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
  const after = (await stat(dest)).size;
  await rename(file, join(ORIGINALS, `${basename(dirname(file))}-${basename(file)}`));
  console.log(`${basename(file)}  ${(size / 1024).toFixed(0)}KB -> ${basename(dest)} ${(after / 1024).toFixed(0)}KB`);
}
