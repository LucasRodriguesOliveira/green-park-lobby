# Green Park Lobby API

## Description
Desafio técnico de backend da Green Acesso.

## Installation

<details>
<summary>Packages</summary>
  <details>
  <summary>npm</summary>

  ```bash
  $ npm i
  ```
  </details>

  <details>
  <summary>yarn</summary>

  ```bash
  $ yarn
  ```

  </details>
</details>

Add a file at the root of the project: `.env`
you can copy/paste `.env.example`

you can use this application with docker also:
`docker compose up -d`

warning: this project contains a package `bcrypt` that is used to encrypt passwords
before saving in the database, due to differences about the package in windows and linux (used in docker and the container) it throws some errors
Personal recommendation: if you are using windows, i sugest you to run directly in your
computer

either with docker or in local machine, typeorm global package will be necessary (npx or global installation)
`yarn global add typeorm`

with typeorm available and a database up and running, run the migrations by:
`yarn typeorm migration:run -d ./db/postgresql`

wait for completition and you finally can

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Green Park Lobby is [MIT licensed](LICENSE).
