# Node TypeORM

> Node.js, TypeScript, GraphQL, Express, TypeORM, IoC, SOLID, Jest, PostgreSQL, TypeGraphQL.

API uses `inversify` as IoC container. More details: https://www.npmjs.com/package/inversify

## Installation guide

```
# clone repository

# install dependencies
$ yarn

# copy and modify the .env.example to .env.{NODE_ENV} or .env

# start
$ yarn dev
```

### `yarn test`

Runs the test cases from the folder `src/tests`

### `yarn db:seed`

Seeds database.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn docs`

Creates api doc file. Can be viewed from: ${api_url}/${version}/docs

## Migration

Run migration
`yarn typeorm migration:run`

Runs migration from
`yarn typeorm:js migration:run`

Generate migration(Make sure you run migration before generating a new
`yarn typeorm migration:generate -n ${MigrationClassName} -p`

## Using Docker

Make sure docker and docker-compose is installed in your system

```
$ docker-compose up
```

Specifying env file:

```
$ docker-compose [--env-file path-to-env-file] [-f <path-to-docker-compose>] up
```

Run migration

```
$ docker-compose exec app yarn typeorm migration:run
```

To seed the database, first get the app container id: `docker ps`, then run:

`$ docker exec 'container_id' yarn db:seed`

or (using docker-compose)

`$ docker-compose exec app yarn db:seed`

## Other available scripts

#### `yarn prettier:fix`

Runs prettier on the `.ts` files under `src` folder.

#### `yarn lint:check`

Checks for any error/bugs.

#### `yarn lint:fix`

Runs lint.

#### `yarn typeorm`

Cli for typeorm. Usage `yarn typeorm migration:create -n modify-user-firstname -p`

#### `yarn dev:build`

Runs build server.

### Style/GraphQL guide.

- Tab width: 2
- Trailing comma
- Single quote for the string
- nounVerb convension for queries(if any), mutations and subscriptions(if any). i.e noun first then verb with camelcase. e.g userCreate
