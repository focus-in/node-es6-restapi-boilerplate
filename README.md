# node-es6-restapi-boilerplate

An easy start restapi nodejs project boilerplate for development, in module architecture with airbnb coding standerd & all latest stable packages with es6 code format.

Start coding fast with stright forwarded application flow and build in user & authentication modules, with integration & unit test & apidoc rest api documentation.


## Getting Started
------
You can clone & follow the below sections to make it use of your own.


## Pre-requisites
------
Make sure you have installed all of the following prerequisites on your development machine:

- [NodeJS](https://nodejs.org/en/) (v8.11.4)
- [MongoDB](http://www.mongodb.org/downloads) (v3.6.4)
- [Git](https://git-scm.com/downloads) (v2.15.2)
- [Yarn](https://yarnpkg.com/en/) (v1.6.0)


## Dependencies
------
Some popular dependencies used to build the boileplate.

| Dependency  | Description |
|-------------|-------------|
| express | Minimalist web framework |
| mongoose | MongoDB ODM |
| bluebird  | Fully featured promise library |
| commander | Nodejs cli solution |
| passport | Authentication library for nodejs |
| moment | Parse, validate, manipulate date |
| joi | Object schema validation |
| pug | HTML template language |
| lodash | Utility library |
| nodemailer | Mailer package |
| onesignal-node | Push notification |
| textlocal | SMS package |
| morgan | HTTP request logger |
| winston | Nodejs logger pakage |

Some popular dev dependencies

| Dependency  | Description |
|-------------|-------------|
| eslint | Pattern checker for JS |
| nodemon | Montior script runner for nodejs |
| apidoc | Resful api documentation |
| mocha | Test framework |
| chai | Assertion library for nodejs |
| supertest | Test HTTP servers |
| sinon | JS test spies, stub & mocks |
| coveralls | Test runner report |
| faker | Generate fake data |

Some optional packages to install globally in your dev machine.

| Dependency  | Installation |
|-------------|--------------|
| EsLint            | `yarn global add eslint`            |
| Nodemon           | `yarn global add nodemon`           |


## Installation
------
- Clone the repository from github as your project name
```shell
git clone https://github.com/focus-io/node-es6-restapi-boilerplate.git project-name
cd project-name
```

- Install dependent packages
```shell
yarn install
```


## Configuration
------
- Create environment file
```shell
mv .env.example .env
```

- Change your application name & database name from .env
```shell
vi .env
```

- Run the project
```shell
yarn start
```

- Application will start in port 3000 by default (http://localhost:3000/api/v1)


## Usage
------

- To create user
```shell
yarn scripts user create
```


## Docs & Lint
------
- Generate api docs by running
```shell
yarn docs
```

- Test lint by
```shell
yarn lint
```

- Lint fixes
```shell
yarn lint:fix
```


## Test & Coverage
------
- Unit Test
```shell
yarn test:unit
```

- Integration Test
```shell
yarn test:integration
```

- Test
```shell
yarn test
```

- Test Coverage
```shell
yarn coverage
```


## Deployment
------
YTC


## Contribution
------
We welcome any contribution you make [contributors guidelines](https://help.github.com/articles/setting-guidelines-for-repository-contributors/).


## Versioning
------
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [versions](https://github.com/focus-io/node-es6-restapi-boilerplate/releases) on this repository.


## Authors
------
* [keviveks](https://github.com/keviveks)


## License
------
This project is licensed under the MIT License - see the LICENSE.md file for details


## Acknowledgement
------
Inspirations
- [KunalKapadia/express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)
- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)

## Todo
------
- [ ] Unit Test
- [ ] Test System module
- [ ] Seeder
- [ ] S3 for user image
- [ ] CI/CD
- [ ] Docker
- [ ] Build
