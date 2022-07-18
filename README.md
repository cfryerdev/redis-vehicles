# Set Theory using Redis & Vehicles
A sample redis hydrator using generic vehicle data.


## Getting Started

For this demo we need to mutate data, start redis, and hydrate data with the new data format.

- Mutate Data: ``node --experimental-json-modules index.js``
- Start Redis: `docker run -d --name dev-redis -p 6379:6379 -d redis`
- Hydrate Redis: `node --experimental-json-modules loader.js`
