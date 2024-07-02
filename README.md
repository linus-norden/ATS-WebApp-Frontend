# Nuxt.js and Vue.js Frontend of ATS prototype
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
## Setup
Make sure to install the dependencies:
## npm
npm install

# Development Server
Configure your environment.
Default env is localhost and port 3000
(on `http://localhost:3000`)

## Backend (https://github.com/linus-norden/ATS-WebApp-Backend)
Clone the node.js based backend project and configure it.

Start the backend connecting to the database and providing a rest API at http://localhost:3001. 

Start the backend with

node ./index.js

Example request to test it: http://localhost:3001/api/raum_bereich/15

## Frontend (this project)
Start is done with:

npm run dev

Default (see above) will be on `http://localhost:3000`
