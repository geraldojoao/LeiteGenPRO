# Estrutura do Projeto

Este documento resume a organização do LeiteGen Pro para facilitar revisão técnica, manutenção e publicação no GitHub.

## Visão Geral

O projeto é um app Expo/React Native com TypeScript, Expo Router e Zustand. A arquitetura atual separa telas, componentes, regras de negócio, dados simulados, estado global e utilitários.

```text
LeiteGenPRO/
  app/          Rotas e telas do Expo Router
  assets/       Arquivos estáticos usados pelo app
  components/   UI reutilizável separada por domínio
  constants/    Tema visual e listas fixas do domínio
  data/         Dados locais simulados para o MVP
  docs/         Documentação complementar
  hooks/        Hooks reutilizáveis
  logic/        Regras de negócio puras e testáveis
  store/        Estado global com Zustand
  types/        Tipos TypeScript do domínio
  utils/        Funções auxiliares e formatadores
```

## Rotas E Telas

```text
app/
  _layout.tsx          Layout raiz, carregamento de fontes e providers
  +html.tsx            HTML customizado para web
  index.tsx            Tela inicial/login
  checkout.tsx         Fluxo de checkout visual
  (tabs)/_layout.tsx   Navegação por abas
  (tabs)/home.tsx      Painel inicial
  (tabs)/busca.tsx     Busca e filtros de touros
  (tabs)/carrinho.tsx  Favoritos/carrinho
  (tabs)/marketplace.tsx Marketplace e comparativos
  (tabs)/plantel.tsx   Gestão de matrizes
  (tabs)/perfil.tsx    Perfil do usuário
  touro/[id].tsx       Detalhe de touro
```

## Componentes

```text
components/common/      Componentes genéricos usados em várias telas
components/catalog/     Componentes do catálogo, filtros, badges, ROI e gráficos
components/checkout/    Componentes do fluxo de checkout
components/plantel/     Componentes do rebanho e cadastro de matrizes
```

## Domínio E Estado

```text
constants/domain.ts       Listas de raças, biomas, tipos de sêmen e pesos padrão
constants/theme.ts        Cores, fontes, espaçamentos, raios e sombras
data/matrizes.ts          Matrizes simuladas para demonstração
data/touros.ts            Catálogo simulado de touros
logic/                    Cálculos, recomendações e classificadores
store/                    Stores Zustand para catálogo, filtros, favoritos e matrizes
types/index.ts            Tipos centrais do domínio
utils/                    Formatação e funções auxiliares de catálogo
```

## Configuração

```text
package.json        Scripts e dependências npm
package-lock.json   Lockfile para instalações reproduzíveis
app.json            Configuração Expo
babel.config.js     Preset Expo e plugin Reanimated
tsconfig.json       TypeScript estrito e alias @/*
.eslintrc.js        Configuração ESLint baseada no Expo
vercel.json         Build e rewrites para publicação web
.gitattributes      Normalização de texto no Git
.gitignore          Arquivos gerados, locais e sensíveis fora do versionamento
```

## Arquivos Que Devem Ficar Fora Do Git

O `.gitignore` cobre os principais arquivos gerados ou locais:

- `node_modules/`: dependências instaladas via `npm install`.
- `.expo/` e `.expo-shared/`: cache e metadados locais do Expo.
- `expo-env.d.ts`: arquivo gerado pelo Expo.
- `dist/`, `web-build/` e `build/`: saídas de build.
- `.vercel/` e `.netlify/`: metadados locais de deploy.
- `.env*`: variáveis de ambiente e segredos locais.
- `*.log`: logs de execução local.
- `.vs/`, `bin/`, `obj/`, `*.user` e `*.suo`: arquivos locais do Visual Studio/.NET.
- `.DS_Store`, `Thumbs.db`, `desktop.ini`, `*.tmp` e similares: arquivos de sistema e temporários.

## Candidatos De Limpeza Local

Os itens abaixo são seguros para remover localmente quando não houver processo de desenvolvimento rodando. Eles podem ser recriados por comandos de instalação ou build:

```text
node_modules/
.expo/
.vercel/
dist/
expo-env.d.ts
expo-web-8081.log
```

Remover esses itens não altera o código-fonte. Depois da limpeza, use `npm install` para restaurar dependências e `npm run build:web` para gerar novamente `dist/`.

## Observações

- Não há pasta de testes no momento.
- A licença do projeto ainda precisa ser definida antes de uma publicação pública.
- O arquivo `app/(tabs)/perfil.tsx` aparece como não rastreado no Git e deve ser adicionado caso faça parte da versão final.
