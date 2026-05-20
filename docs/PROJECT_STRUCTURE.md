# Estrutura do Projeto

Este documento resume a organização adotada para manter o repositório limpo e fácil de avaliar.

## Pastas Mantidas

```text
app/          Telas e rotas do Expo Router.
assets/       Arquivos estáticos usados pelo app.
components/   UI reutilizável separada por domínio.
constants/    Tema, cores, espaçamentos e listas fixas.
data/         Dados locais simulados para o MVP.
hooks/        Hooks de layout, favoritos, catálogo e conectividade.
logic/        Regras de negócio puras e testáveis.
store/        Estado global com Zustand.
types/        Tipos TypeScript do domínio.
utils/        Funções auxiliares e formatadores.
docs/         Documentação complementar.
```

## Organização de Componentes

```text
components/common/      Componentes genéricos usados em várias telas.
components/catalog/     Componentes ligados ao catálogo de touros.
components/checkout/    Componentes do fluxo de checkout.
components/plantel/     Componentes do rebanho e cadastro de matrizes.
```

## Arquivos Ignorados no Git

O `.gitignore` evita subir:

- `node_modules/`
- `.expo/`
- `.vercel/`
- `dist/`
- logs
- arquivos `.env`
- builds nativos
- screenshots/checks temporários

## Critério de Limpeza

Foram removidos apenas arquivos gerados, temporários ou configurações sem uso confirmado. Código-fonte, dados, assets, rotas, stores e regras de negócio foram preservados.
