# Catálogo Pet

Projeto base em Vue 3 + Vite para catálogo de acessórios pet.

## Instalação

```bash
npm install
npm run dev
```

## Deploy no Vercel

Execute o build e faça o upload da pasta `dist/` para o Vercel:

```bash
npm run build
```

Arquivos de dados devem ficar em `public/data/`. O arquivo `vercel.json` já
configura cabeçalhos `Cache-Control` para esta pasta, permitindo que o conteúdo
fique armazenado na CDN por 24 horas.
