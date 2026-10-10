# bm.inc — site (v2)

Holding Black Money Inc.: Home, BM Solutions, Afreektech, Movimento Black Money e Afreek.Lab.

- **Stack:** Vite (multi-page) + CSS puro com tokens MBM + Lenis (scroll suave). Sem framework.
- **Design:** Figma `[ATIVO] Movimento Black Money (SITE)` → página "Protótipo" → seção V2.
- **Tokens:** `src/styles/tokens.css` (fonte: `.assets/mbm-tokens.md`).
- **Assets:** sempre em `.assets/` (servido na raiz do site). Fotos grandes são otimizadas com `npm run optimize`
  (originais ficam em `.assets/figma/_originals`, fora do git).

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Pendências conhecidas

- **Hero da Home:** vídeo em `.assets/figma/home/hero.mp4` com overlay de 70% preto e poster `hero.webp`.
- **Formulários:** sem backend. Defina `VITE_FORM_ENDPOINT` (POST JSON) e, opcionalmente, `VITE_FORM_TO`
  (destino do fallback `mailto:`; padrão `contato@movimentoblackmoney.com.br`).
- Textos placeholder do Figma mantidos: terceiro número da Home ("XX%" / "XXXX").
