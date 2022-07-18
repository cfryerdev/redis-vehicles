# Set Theory using Redis & Vehicles
A sample redis hydrator using generic vehicle data. In thie example we have two files:

- `_vehicles.json`: The vehicle database we will be searching.
- `Loader.js`: Hydrates redis with sets based on the vehicle database. 


## Getting Started

For this demo we need to start redis and hydrate data in the new searchable format.

1) Start Redis: `docker run -d --name dev-redis -p 6379:6379 -d redis`
2) Hydrate Redis: `node --experimental-json-modules loader.js`

Now we can start redis commander which is the tool we will use to look at the data.

3) Install: `npm install -g redis-commander`

## Looking at the data

First off start Redis Commander by running `redis-commander` in the terminal.
