/**
 * Fail if packages other than @einoder/ui create DOM or ship page CSS.
 * Algorithms may allocate canvases for compute; they are excluded.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const packagesDir = join(root, 'packages');

const FORBIDDEN = [
  { re: /document\.createElement\s*\(/, label: 'document.createElement' },
  { re: /\.innerHTML\s*=/, label: 'innerHTML' },
  { re: /\.style\.cssText\s*=/, label: 'cssText' },
];

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);
const ALLOW_DOM = new Set(['ui', 'algorithms']);
const ALLOW_CSS = new Set(['ui', 'tokens']);

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, acc);
    else acc.push(path);
  }
  return acc;
}

const findings = [];
for (const name of await readdir(packagesDir)) {
  const pkgRoot = join(packagesDir, name);
  if (!(await stat(pkgRoot)).isDirectory()) continue;
  const files = await walk(pkgRoot);
  for (const file of files) {
    const rel = relative(root, file).replaceAll('\\', '/');
    const ext = extname(file);
    if (ext === '.css' && !ALLOW_CSS.has(name)) {
      findings.push(`${rel}: CSS file outside @einoder/ui and @einoder/tokens`);
      continue;
    }
    if (!['.js', '.mjs', '.ts'].includes(ext)) continue;
    if (ALLOW_DOM.has(name)) continue;
    const src = await readFile(file, 'utf8');
    for (const rule of FORBIDDEN) {
      if (rule.re.test(src)) findings.push(`${rel}: ${rule.label}`);
    }
  }
}

if (findings.length) {
  console.error('local-DOM lint failed:\n' + findings.join('\n'));
  process.exit(1);
}

console.log('local-DOM lint ok');
