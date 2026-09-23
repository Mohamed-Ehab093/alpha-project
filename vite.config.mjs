import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const pages = [
  'index.html',
  'about.html',
  'branches.html',
  'breakdowns.html',
  'cabins.html',
  'contact.html',
  'factory.html',
  'installation.html',
  'maintenance.html',
  'modernization.html',
  'parts.html',
  'projects.html',
];

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace('.html', ''), resolve(projectRoot, page)])
      ),
    },
  },
});
