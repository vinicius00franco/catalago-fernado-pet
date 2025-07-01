# 🐾 Catálogo Pet

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

Sistema completo de catálogo de produtos para pet shops com diferentes níveis de usuário, carrinho de compras, filtros avançados e tema escuro/claro.

## ✨ Funcionalidades

### 🛍️ Catálogo de Produtos
- **Filtros avançados**: busca por nome, categoria, marca e faixa de preço
- **Ordenação**: por nome, preço, categoria ou marca (crescente/decrescente)
- **Visualização responsiva**: grid adaptável para diferentes tamanhos de tela
- **Desconto por role**: preços diferenciados por tipo de usuário

### 👥 Sistema de Usuários
- **4 tipos de usuário**: consumidor, loja, distribuidor e admin
- **Autenticação JWT**: login/logout seguro com cookies HTTP-only
- **Preços personalizados**: descontos automáticos baseados no tipo de usuário
  - Consumidor: preço normal + 10%
  - Loja: desconto de 10%
  - Distribuidor: desconto de 20%
  - Admin: preço base

### 🛒 Carrinho de Compras
- **Adicionar/remover produtos** com controle de quantidade
- **Painel fixável**: opção de manter carrinho sempre visível
- **Persistência**: dados salvos no localStorage
- **Cálculo automático**: total de itens e preço final

### 🎨 Interface e UX
- **Tema escuro/claro**: alternância automática ou manual
- **Design responsivo**: Bootstrap 5 com customizações
- **Loading states**: indicadores visuais para operações assíncronas
- **Tratamento de erros**: mensagens amigáveis para o usuário

### 📊 Gerenciamento de Dados
- **Múltiplos formatos**: suporte a JSON, CSV e Parquet
- **Cache inteligente**: dados salvos localmente com TTL
- **Validação robusta**: verificação de dados em tempo real

## 🏗️ Arquitetura

### Stack Tecnológica
- **Frontend**: Vue 3 + Composition API + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5 + Bootstrap Icons
- **Estado**: Pinia (Vuex successor)
- **Roteamento**: Vue Router 4
- **Estilização**: SCSS com design system customizado

### Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
│   └── shared/         # Componentes compartilhados
├── pages/              # Páginas da aplicação
├── stores/             # Gerenciamento de estado (Pinia)
├── router/             # Configuração de rotas
├── services/           # Serviços e APIs
├── utils/              # Utilitários e helpers
├── types/              # Definições TypeScript
├── composables/        # Lógica reutilizável
├── config/             # Configurações da aplicação
└── design-system/      # Sistema de design (SCSS)
```

### Padrões Arquiteturais
- **Separation of Concerns**: clara separação entre lógica, apresentação e dados
- **Composition over Inheritance**: uso extensivo da Composition API
- **Single Responsibility**: cada módulo tem uma responsabilidade específica
- **DRY (Don't Repeat Yourself)**: reutilização através de composables e utilitários

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd catalago-fernado-pet
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run preview         # Preview do build

# Qualidade de código
npm run lint            # ESLint com correção automática
npm run lint:check      # Verificar lint sem correções
npm run format          # Formatação com Prettier
npm run format:check    # Verificar formatação
npm run type-check      # Verificação de tipos TypeScript

# Utilitários
npm run clean           # Limpar cache e build
npm run build:analyze   # Build com análise de bundle
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Catálogo Pet
```

### Dados de Produtos
Coloque seus arquivos de dados em `public/data/`:
- `produtos.json` - Arquivo JSON com produtos
- `produtos.csv` - Arquivo CSV alternativo
- `produtos.parquet` - Arquivo Parquet (requer API)

### Usuários de Teste
```javascript
// Usuários pré-configurados
{ username: 'admin', password: 'admin', role: 'admin' }
{ username: 'user', password: 'user', role: 'consumer' }
```

## 🚀 Deploy

### Deploy no Vercel

1. **Build o projeto**
```bash
npm run build
```

2. **Configure o vercel.json** (já incluído)
```json
{
  "headers": [
    {
      "source": "/data/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400" }]
    }
  ]
}
```

3. **Deploy**
- Faça upload da pasta `dist/` para o Vercel
- Configure domínio personalizado se necessário

### Deploy em outros provedores
O projeto gera arquivos estáticos que podem ser hospedados em:
- Netlify
- GitHub Pages
- Surge.sh
- Firebase Hosting

## 🔍 Funcionalidades Técnicas Detalhadas

### Gerenciamento de Estado
```typescript
// Store de produtos com filtros e cache
const productStore = useProductStore()
productStore.updateFilters({ search: 'ração' })
productStore.filteredProducts // produtos filtrados
```

### Autenticação
```typescript
// Login e verificação de role
const authStore = useAuthStore()
await authStore.login('username', 'password')
const hasAdminAccess = authStore.isAdmin
```

### Carrinho de Compras
```typescript
// Adicionar produto com quantidade
const cartStore = useCartStore()
cartStore.add(product, 2)
cartStore.totalPrice // preço total calculado
```

### Temas
```typescript
// Alternância de tema com persistência
const themeStore = useThemeStore()
themeStore.toggle() // light ↔ dark
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: [seu-email@exemplo.com]
- 💬 Issues: [GitHub Issues](link-para-issues)
- 📖 Documentação: [Wiki do projeto](link-para-wiki)

---

Feito com ❤️ e ☕ para a comunidade pet! 🐶🐱
