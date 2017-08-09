# DEV API

## Simple node project with REST API and Security (OAuth and role based security)

## Prerequisites

[Node.js v. 7.x](https://nodejs.org)

## Installation

`npm install`

---

## Scripts

- `npm start` - Starts server at [http://localhost:3001](http://localhost:3001)

---

## Features

- REST API - Based on json-server, with some security enhancements. Just drop a json file into the data\collections folder to use.
- Dev OAuth Backend Service - Allow developers to easily test security.

---

## Detailed Instructions

- npm Scripts
  - start - Shortcut to build and serve
  - build - Creates db.json based on json files found in collections.
  - serve - starts the nodemon server
- Files
  - data\collections - This is used for adding additional APIs - open the collections folder and create a json file like post.json or to-do.json. The next build will create a database based on these.
  - auth-routes.js - middleware integrated with json-server for OAuth routes.
  - build.js - created db.json based on data found in the collections folders.
  - config.js - provides base configuration for serving and building.
  - serve.js - runs json-server integrated with auth-routes.
  - Security
  - Tweak the users.json and users.json files to add users or role base security. Documenation TBD.
- Integration with [angular-cli-starter](https://github.com/jmlivingston/angular-cli-starter) project
  - proxy.conf.json - `ng serve` uses the proxy.conf.json file to provide a proxy to the dev-api.
  - core\auth\shared\auth.service.ts - This service is used for handling OAuth integration.
  - core\config\environment.service.ts - This service provides configuration for OAuth and API backend services.
  - Check out post.service.ts and to-do-service.ts and see show they implement rest-api.base.ts. Following this simple pattern will provide you with a REST API with minimal effort.

Note: The API and OAuth server are based on [json-server](https://github.com/typicode/json-server) and the example [angular2-authentication-sample](https://github.com/auth0-blog/angular2-authentication-sample)
