# Set Theory using Redis & Vehicles
A sample redis hydrator using generic vehicle data. In thie example we have two files:

- `_vehicles.json`: The vehicle database we will be searching, 1800 records.
- `loader.js`: Hydrates redis with sets based on the vehicle database. 

During this example, we will be using redis and basic set theory principles to search vehicles quickly.

### Important Terms

- **Set:** A unique list of values, belonging to a key.
- **Superset:** A set of sets.
- **Intersection:** The result of two or more sets joined, of only the values which belong to all sets. (No duplicates)
- **Union:** The result of two or more sets joined, containing the values from all sets. (No duplicates)
- **Inverse Sets:** A set containing keys, where the value is the key.

### Recommended Watches

These tend to be quite heavy, so I recommend watching these after this exercise. 

- https://www.youtube.com/watch?v=tyDKR4FG3Yw
- https://www.youtube.com/watch?v=xZELQc11ACY
- https://www.youtube.com/watch?v=4TlCToZZ5gA

## Getting Started

For this demo we need to start redis and hydrate data in the new searchable format.

1) Start Redis: `docker run -d --name dev-redis -p 6379:6379 -d redis`
2) Install Dependencies: `npm i`
3) Hydrate Redis: `node --experimental-json-modules loader.js`

Now we can start redis commander which is the tool we will use to look at the data.

4) Install: `npm install -g redis-commander`

### Looking at the data

First off start Redis Commander by running `redis-commander` in the terminal. Once you have that running, navigate to: `localhost:8081` in a web browser and add a connection to `localhost:6379`. Now you should see your databases, inside `db0` will be our sets we will be working with today.



### Duplicative Data & Lenses

You will immediately notice the duplicitive nature of this pattern, but this is absolutely intentional. Each set is a "lense" in which you look at the data. We trade response time, for storage cost, which is signifigantly cheaper.

### Browsing a Set

### Supersets

### Inverse Sets

### Your first Union

### Your first Intersection

## Conclusion

You can use this pattern to easily build out complex search/filtering systems using basic set theory principles. 
