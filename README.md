# vFlashCards

## Description

vFlashCards is built for students on the go. The project aims to create a convenient and accessible learning tool. The full stack application will feature:

- The option to create sets of virtual flash cards.
- Browse your personal library of flash cards.
- Brower publicly shared flash cards with fellow vFlashCards community.

* * *

## Project Management Board:
Tasks and timeline can be found via:
[Github Project](https://github.com/users/not-x/projects/1)

***

## Development Setup

- [Node.js](https://nodejs.org) (ver 20)
- [PostgresSQL](https://www.postgresql.org/download/) (ver 16)
***
## Database setup

- Install PostgreSQL Server v16
    - Remember your password!
- Create the database via `pgAdmin` or `SQL Shell`
    - DB Name: `vflashcards`
- Connect to the database either via `pgAdmin` or `SQL Shell`: `\c vflashcards`
- Run the script from `./Deliverables/Database/2023-10-29-vFlashCards-script.sql`
    - Installs `uuid` module
    - Creates `ENUM`view type (public, private)
    - Creates tables


***
## Client & Server/API Installation

1. Clone the repo:
```
git clone https://github.com/not-x/vFlashCards.git
```
2. Install the dependencies for **client** via terminal:
```
cd ./app/client 
npm i
```
3. Install the dependencies for **server/api**. Browse to the server/api via terminal:
```
cd ./app/server/
npm i
```

4. Create a `.env` file under `./app/server/`. Populate it with the environmental variables and follow the notes below:
```
TOKEN_SECRET = [insert secret]
# Secret can be generated via bcrypt
# Note: JSONWebtoken is unsuitable for web app for security reasons. Revision may be done in the future.
PORT = [your server/api port number here]
DB_PASSWORD = [passord to your DB dev server]
DB_USER = [username to your DB dev server]
DB_HOST = localhost
# Either localhost or development DB server IP
DB = vflashcards
DB_PORT = [DB dev server]
# DB_PROD = \[DB prod server, name, key, etc\]
# May require information in addition to the prod server host
```
* * *
## Run the application
Use separate terminal for client and server/backend/api:
- Start Client under `./app/client/`
```
npm start
```
- Start Server/API under `./app/server/` using either:
```
npm start
```
or
```
node server
```