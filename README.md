# Set Theory using Redis & Vehicles (Beginners)
A sample redis hydrator using generic vehicle data. In thie example we have two files:

- `database.json`: The vehicle database we will be searching, 1800 records.
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
3) Lastly, Hydrate Redis: `npm start`

First lets ensure docker is running...

![Docker_Running](images/docker_running.png)

Now we can start redis commander which is the tool we will use to look at the data.

4) Install: `npm install -g redis-commander`

### Looking at the data

First off start Redis Commander by running `redis-commander` in the terminal. Once you have that running, navigate to: `localhost:8081` in a web browser and add a connection to `localhost:6379`. Now you should see your sets which we will be working with today.

![Redis_Hydrated](images/redis_hydrated.png)

Well how do we create these sets... well its actually quite simple and requires very little code. As you see below, we have a simple loop which puts data in the correct set by using a namespace string separated by the `:` character.  Thats really it. This current example is written in node, but Redis supports almost every language you could think of. 

![Code_Hydrate](images/code_hydrate.png)

**Note: Obviously the above code could be done in parallel but I kept it synchronous for ease of reading.**

Lets continue on...

### Duplicative Data & Lenses

You will immediately notice the duplicitive nature of this pattern, but this is absolutely intentional. Each set is a "lense" in which you look at the data. We trade response time, for storage cost, which is signifigantly cheaper.

### Browsing a Set

Information here...

![Redis_Sets](images/redis_sets.png)

### Inverse Sets

Information here...

![Redis_InverseSets](images/redis_inversesets.png)

### Composits or Supersets

Information here...

![Redis_Composits](images/redis_composits.png)

### Data

Information here...

![Redis_Data](images/redis_data.png)

## Finding Data

Alright here is where the rubber hits the road: How do I use this data to create ultra high performant search/filter operations across this dataset? Lets get started...

### Your first Union

Information here...

### Your first Intersection

Example: Lets say we want to limit our responses to all  2019 cars with two doors... What would that command look like? Well if we look we have sets for these attributes: 

```
sets:doors:*
sets:types:*
sets:years:*
```

So if we want to find our vehicle, we need to ensure we only return vin numbers that exist in **ALL THREE** of these sets right? (the order of the sets does not matter here)

Command: 
```
SINTER sets:doors:2 sets:types:Car sets:years:2019
```
Result:
```
1) "1G1FB3DS1K0113498"
2) "2C3CDZJG4KH617616"
3) "WMWXP7C59K2A49781"
4) "JN1AZ4EH0KM421666"
5) "3VWFD7ATXKM717101"
6) "1FA6P8CF4K5196010"
7) "1FA6P8TH5K5175362"
8) "2C3CDZAG0KH731743"
```

As we can see, we have 8 unique vins that exist in these three sets. Cool!

### Extra: Returning json single result

Information here...

### Extra: Returning json list results

So we have an array of vin numbers, well now we want to return this as an array of json payloads right? Thats why we have our `data:vehicles:*` set right?

To make this work youc an use a library, or a redis-cli module called: "[RedisJSON](https://redis.io/docs/stack/json/)" Which will let you essentially return them as an array of vehicles:

Command: 
```
JSON.ARRAPPEND data:vehicles:1G1FB3DS1K0113498 data:vehicles:2C3CDZJG4KH617616 $
```

But I would recommend doing this in code with a library, just make sure you do this union of values on the redis server, not in code. We dont want to hit redis once for each record 😛. Example:

![Redis_JsonAppend](images/code_jsonappend.png)

## Conclusion

You can use this pattern to easily build out complex search/filtering systems using basic set theory principles. 

Want to know more commands? [https://redis.io/commands/](https://redis.io/commands/)