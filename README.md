# Nuxt.js and Vue.js Frontend of ATS prototype
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.



This repository contains files that were developed as part of a bachelor's thesis about Asset Tracking in Hospitals written in German.
For this reason, many of the variable names and comments are written in German.

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

## All Repositories needed to build ATS:
https://github.com/linus-norden/mosquitto-UNIX-time

https://github.com/linus-norden/ATS-ESP32-BLEScan

https://github.com/linus-norden/ATS-ESP32-WiFiMesh

https://github.com/linus-norden/ATS-WebApp-Frontend

https://github.com/linus-norden/ATS-WebApp-Backend

https://github.com/linus-norden/ATS-Python-Microservice

https://github.com/linus-norden/ATS-SQL-DB
