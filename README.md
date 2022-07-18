# Set Theory using Redis & Vehicles
A sample redis hydrator using generic vehicle data.


## Getting Started

For this demo we need to start redis and hydrate data in the new searchable format.

- Start Redis: `docker run -d --name dev-redis -p 6379:6379 -d redis`
- Hydrate Redis: `node --experimental-json-modules loader.js`

Now we can start redis commander and look at the data

- Install: `npm install -g redis-commander

## Looking at the data

First off start Redis Commander by running `redis-commander` in the terminal.
