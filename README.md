# LeiteGen Pro

![Expo](https://img.shields.io/badge/Expo-SDK%2051-000020?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-MVP%20funcional-2E7D32)
![License](https://img.shields.io/badge/license-a%20definir-lightgrey)

LeiteGen Pro é um aplicativo Expo/React Native para gestão simples de rebanho leiteiro, catálogo de touros e apoio à tomada de decisão em acasalamentos. O MVP foi pensado para produtores rurais e equipes de fazenda, com navegação direta, leitura rápida, botões grandes e funcionamento offline-first.

O projeto usa dados locais simulados e persistência no dispositivo. Não há backend, autenticação real nem cobrança real nesta versão.

## Funcionalidades

- Painel inicial com resumo do dia, alertas e atalhos operacionais.
- Gestão de matrizes com cadastro, filtros por situação e indicadores de atenção.
- Catálogo de touros com busca e filtros por raça, sêmen, bioma, preço e características genéticas.
- Favoritos e carrinho para montar uma seleção de touros.
- Checkout visual simulado para demonstração do fluxo de compra.
- Tela detalhada do touro com DEPs, qualidade do sêmen, adaptação climática e simulação de retorno.
- Recomendações de acasalamento com base nos dados da matriz.
- Persistência local para uso offline durante a demonstração.

## Stack

- Expo SDK 51
- React Native 0.74
- React 18
- TypeScript
- Expo Router
- Zustand
- AsyncStorage
- MMKV
- React Native SVG
- Expo Google Fonts
- Expo Vector Icons
- Vercel para publicação web

## Pré-Requisitos

- Node.js LTS
- npm
- Git
- Expo via `npx`

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Execução Local

Inicie o ambiente Expo:

```bash
npm run start
```

Atalhos úteis no terminal do Expo:

- `w` abre a versão web.
- `a` abre no Android.
- `i` abre no iOS.

Também é possível iniciar diretamente no navegador:

```bash
npm run web
```

## Scripts

```bash
npm run start       # inicia o Expo
npm run android     # inicia no Android
npm run ios         # inicia no iOS
npm run web         # inicia no navegador
npm run typecheck   # valida TypeScript
npm run lint        # executa ESLint
npm run build:web   # gera build web em dist/
```

## Estrutura De Pastas

```text
app/                    Rotas e telas do Expo Router
  (tabs)/               Abas principais do aplicativo
  touro/[id].tsx        Tela de detalhe de touro
  checkout.tsx          Fluxo de checkout visual

assets/                 Ícones, splash screen e favicon
components/             Componentes reutilizáveis organizados por domínio
  catalog/              UI do catálogo de touros
  checkout/             Componentes do checkout
  common/               Componentes compartilhados
  plantel/              Componentes do rebanho

constants/              Tema visual e constantes de domínio
data/                   Dados locais simulados
hooks/                  Hooks reutilizáveis
logic/                  Regras de negócio puras
store/                  Stores Zustand
types/                  Tipos TypeScript do domínio
utils/                  Formatadores e utilitários
docs/                   Documentação técnica complementar
```

## Qualidade

- Código separado por responsabilidade.
- Componentes agrupados por domínio.
- Regras de negócio isoladas em `logic/`.
- Tipos centralizados em `types/`.
- Dados simulados em `data/`.
- Arquivos gerados, caches e dependências locais protegidos pelo `.gitignore`.

Antes de publicar ou abrir uma pull request, rode:

```bash
npm run typecheck
npm run lint
```

## Publicação Web

O projeto inclui [vercel.json](./vercel.json) para exportar a versão web do Expo.

Configuração recomendada na Vercel:

- Install Command: `npm install`
- Build Command: `npm run build:web`
- Output Directory: `dist`

## Contribuição

Este projeto ainda é um MVP. Para contribuir:

1. Crie uma branch a partir de `main`.
2. Faça alterações pequenas e focadas.
3. Rode `npm run typecheck` e `npm run lint`.
4. Abra um pull request descrevendo o objetivo, as telas afetadas e os testes executados.

## Licença

A licença ainda não foi definida. Antes de publicar o repositório como público, escolha uma licença compatível com o objetivo do projeto, por exemplo MIT para portfólio/open source ou uma licença proprietária se o código não puder ser reutilizado.
