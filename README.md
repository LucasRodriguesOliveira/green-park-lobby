# Green Park Lobby API

[![unit-test](https://github.com/LucasRodriguesOliveira/green-park-lobby/actions/workflows/unit-test.yaml/badge.svg?event=pull_request)](https://github.com/LucasRodriguesOliveira/green-park-lobby/actions/workflows/unit-test.yaml)
[![e2e-test](https://github.com/LucasRodriguesOliveira/green-park-lobby/actions/workflows/e2e-test.yaml/badge.svg?event=pull_request)](https://github.com/LucasRodriguesOliveira/green-park-lobby/actions/workflows/e2e-test.yaml)

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

## Usage
The application works on a medium-size complex access authorization system where a user of a certain user-type can or cannot access a api module based on the permissions groups assigned to itself. Consider the following situation:

There is a fictional module called `company` which can list, find, create, update and delete companies. every logged in users can access the module (authentication), but only those with a specific permission for the specific module can access any of the operations:

Consider those 2 users:
Ford Prefect (Admin)
Arthur Dent (Sales)

Athur Dent can only find data about his own user and update it, and about companies, as sales, he cannot change any data, only query, so he can make calls
By the other hand, Ford, his friend, have access to all permissions over all the modules

<details>
<summary>User Type table</summary>
for the sake of the example, desconsider all columns that are not mentionated

| id | description |
| --- | --- |
| 1 | ADMIN |
| 2 | SALES |
</details>

<details>
<summary>User table</summary>
for the sake of the example, desconsider all columns that are not mentionated

| id | name | username | userTypeId |
| --- | --- | --- | --- |
| 1 | Ford Prefect | f.prefect | 1 |
| 2 | Arthur Dent | a.dent | 2 |
</details>

<details>
<summary>Permission table</summary>
for the sake of the example, desconsider all columns that are not mentionated

| id | description |
| --- | --- |
| 1 | LIST |
| 2 | FIND |
| 3 | CREATE |
| 4 | UPDATE |
| 5 | DELETE |
</details>

<detais>
<summary>Module table</summary>
for the sake of the example, desconsider all columns that are not mentionated

| id | description |
| --- | --- |
| 1 | user |
| 2 | company |
</details>

<details>
<summary>Permission Group table</summary>
for the sake of the example, desconsider all columns that are not mentionated

| id | userTypeId | moduleId | permissionId |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 1 |
| 2 | 1 | 1 | 2 |
| 3 | 1 | 1 | 3 |
| 4 | 1 | 1 | 4 |
| 5 | 1 | 1 | 5 |
| 6 | 1 | 2 | 1 |
| 7 | 1 | 2 | 2 |
| 8 | 1 | 2 | 3 |
| 9 | 1 | 2 | 4 |
| 10 | 1 | 2 | 5 |
| 11 | 2 | 1 | 2 |
| 12 | 2 | 1 | 4 |
| 13 | 2 | 2 | 1 |
| 14 | 2 | 2 | 2 |
</details>

as described in the example in the tables above, it only allows those users with type sales to access just enough to their roles

with enough understanding about how to work with the authorization system, you can use the default user (admin) created at the running of the migrations, you must loggin with its username and password in order to retrieve the access token to interact with the api, since all the routes are protected with JWT.

you can look for each controller file in order to take note about which permission each route requires
at the top of the controller, is defined the module at the controller works on with the decorator `@AppModule` and at method-level is `@AccessPermission` decorator:
```typescript
@Controller('user')
@ApiTags('user')
@AppModule('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ListUserResponseDto,
    isArray: true,
  })
  @UseGuards(JWTGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryUserDto: QueryUserDto,
  ): Promise<ListUserResponseDto> {
    return this.userService.list(queryUserDto);
  }
```

only those `UserType` with permission `LIST` at module `user` can access this route

all the modules, permissions, user types and permission groups needed to work at the bare minimum have been saved when the migrations were ran

feel free to modify the project to allow anyone accessing route or use the api to add the necessary information to allow access. Also, there is a decorator that allow to bypass any permission, even though the specific user-type does not have permission to access the route, simply add at method-level: `@UserRole('YOUR_USER_TYPE_HERE')`
`UserTypeEnum` contains both `ADMIN` and `DEFAULT` types for this situation, you can also add any usertype you have created

if there is any doubt, feel free to get in touch at my e-mail:
[lucasroliveira98@gmail.com](lucasroliveira98@gmail.com)

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
