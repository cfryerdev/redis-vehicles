# Set Theory using Redis & Vehicles
A sample redis hydrator using generic vehicle data. In thie example we have two files:

- `_vehicles.json`: The vehicle database we will be searching.
- `Loader.js`: Hydrates redis with sets based on the vehicle database. 

During this example, we will be using redis and basic set theory principles to search vehicles quickly.

## Getting Started

For this demo we need to start redis and hydrate data in the new searchable format.

1) Start Redis: `docker run -d --name dev-redis -p 6379:6379 -d redis`
2) Hydrate Redis: `node --experimental-json-modules loader.js`

Now we can start redis commander which is the tool we will use to look at the data.

3) Install: `npm install -g redis-commander`

## Looking at the data

First off start Redis Commander by running `redis-commander` in the terminal.


## Browsing a Set

## Supersets

## Inverse Sets

## Your first Union

## Your first Intersection

## Conclusion

You can use this pattern to easily build out complex search/filtering systems using basic set theory principles. 
