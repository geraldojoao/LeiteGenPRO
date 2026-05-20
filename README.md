# LeiteGen Pro

LeiteGen Pro é um aplicativo Expo/React Native para gestão simples de rebanho leiteiro, catálogo de touros e apoio à escolha de acasalamentos. O projeto foi pensado para produtores rurais e trabalhadores de fazenda, com foco em leitura rápida, botões grandes, alto contraste e navegação direta.

Este repositório entrega um MVP funcional sem backend, com dados locais simulados e persistência offline para demonstração técnica, portfólio e evolução futura.

## Principais Funcionalidades

- Tela inicial com resumo do dia, alertas e atalhos rápidos.
- Gestão de rebanho com cadastro de matrizes, filtros por situação e animais que precisam de atenção.
- Catálogo de touros com busca, filtros por raça, sêmen, bioma, preço e características.
- Favoritos/carrinho para montar uma seleção de touros.
- Checkout visual simulado, sem cobrança real.
- Detalhe do touro com dados genéticos, sêmen, clima e simulação de retorno.
- Recomendações de acasalamento com base nas informações da matriz.
- Funcionamento offline-first com dados locais persistidos.

## Tecnologias

- Expo SDK 51
- React Native 0.74
- TypeScript
- Expo Router
- Zustand
- AsyncStorage
- MMKV
- React Native SVG
- Expo Google Fonts
- Expo Vector Icons
- Vercel para publicação web

## Estrutura do Projeto

```text
app/                    Rotas e telas do Expo Router
  (tabs)/               Abas principais do aplicativo
  touro/[id].tsx        Detalhe de touro
  checkout.tsx          Fluxo de checkout visual

assets/                 Ícones, splash e favicon
components/             Componentes reutilizáveis organizados por domínio
  catalog/              Cards e UI do catálogo de touros
  checkout/             Componentes do checkout
  common/               Componentes compartilhados
  plantel/              Componentes do rebanho

constants/              Tema visual e constantes de domínio
data/                   Dados locais simulados
hooks/                  Hooks reutilizáveis
logic/                  Regras de negócio puras
store/                  Stores Zustand
types/                  Tipos TypeScript
utils/                  Formatadores e utilitários
docs/                   Documentação técnica complementar
```

## Como Executar

Requisitos:

- Node.js LTS
- npm
- Expo CLI via `npx`

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run start
```

Atalhos do Expo:

- `w` abre a versão web
- `a` abre Android
- `i` abre iOS

Também é possível iniciar diretamente no navegador:

```bash
npm run web
```

## Scripts Disponíveis

```bash
npm run start       # inicia o Expo
npm run android     # inicia no Android
npm run ios         # inicia no iOS
npm run web         # inicia no navegador
npm run typecheck   # valida TypeScript
npm run lint        # roda ESLint
npm run build:web   # gera build web em dist/
```

## Publicação Web

O projeto possui `vercel.json` configurado para exportar a versão web do Expo.

Configuração recomendada na Vercel:

- Install Command: `npm install`
- Build Command: `npm run build:web`
- Output Directory: `dist`

## Qualidade e Organização

- Código separado por responsabilidade.
- Componentes agrupados por domínio.
- Regras de negócio isoladas em `logic/`.
- Tipos centralizados em `types/`.
- Dados simulados em `data/`.
- Arquivos gerados, caches e dependências locais protegidos pelo `.gitignore`.
- Projeto validado com TypeScript e ESLint.

## Observações

Este MVP não usa backend nem pagamento real. A arquitetura permite evoluir para autenticação, API própria, sincronização em nuvem e recomendações mais avançadas.
