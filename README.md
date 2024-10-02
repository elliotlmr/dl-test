# Turborepo DL-Test

## Quickstart

To start local apps ( Hono backend API + React frontend webapp ) :

```
cd dl-test

pnpm dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `hono-api`: a [Hono.js](https://hono.dev/) app
- `react-app`: a [Vite / React.js](https://vitejs.dev/) app that allows you to

1. sign in / sign up, have access to a user interface to search/add/remove/check friends.
2. have access to an admin backoffice to manage users

- `@repo/types`: a types library shared by both `hono-api` and `react-app` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Usefull commands per apps

- `hono-api`

```
// To start developping ( local )
dev
// To deploy on Cloudflare Workers local version
deploy
// To generate new .sql file
db:generate
// To migrate Neon postgres database from generated .sql file
db:migrate
```

- `react-app`

```
// To start developping ( local )
dev
// To build application for production
build
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Develop

To develop all apps and packages, run the following command:

```
cd dl-test

pnpm dev
```

## Potential improvements

- Add chatrooms between friends (relational table)
- Add more custom fields on user table (profile picture, description, created_at, modified_at, etc..)
- Allow user profile modifications
- Implement blacklist system, firstname, lastname
- Implement frontend for backoffice users pagination
