import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;

// Includes simples: <!--@include nome chave="valor" ...--> -> src/partials/nome.html ({{chave}} é substituído)
function htmlPartials() {
  return {
    name: 'bm-html-partials',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const re = /<!--@include\s+([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;
        const render = (src) =>
          src.replace(re, (_, name, attrs) => {
            const vars = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
            let partial = readFileSync(resolve(root, 'src/partials', `${name}.html`), 'utf8');
            partial = partial.replace(/\{\{([\w-]+)\}\}/g, (_m, k) => vars[k] ?? '');
            return render(partial); // permite partials aninhados
          });
        return render(html);
      },
    },
  };
}

export default defineConfig({
  // Todos os assets do projeto vivem em .assets (servidos na raiz: /figma/..., /Marcas/...)
  publicDir: '.assets',
  plugins: [htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        'bm-solutions': resolve(root, 'bm-solutions.html'),
        afreektech: resolve(root, 'afreektech.html'),
        movimentoblackmoney: resolve(root, 'movimentoblackmoney.html'),
        metodologia: resolve(root, 'metodologia.html'),
        'case-petrobras': resolve(root, 'case-petrobras.html'),
        'termos-de-uso': resolve(root, 'termos-de-uso.html'),
        'politica-de-privacidade': resolve(root, 'politica-de-privacidade.html'),
      },
    },
  },
});
