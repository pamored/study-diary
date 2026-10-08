import { mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');
const publishedFiles = ['index.html', 'styles.css', 'app.js', 'study-logic.js'];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of publishedFiles) {
  await copyFile(resolve(projectRoot, file), resolve(outputDirectory, file));
}
