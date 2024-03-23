# Inventory Api

This is an implementation of a vehicle inventory api, using Redis as the database mechanism, and set theory data modelling concepts.

This project can be ran independently, via docker, or all together using docker-compose. The example has 25,000 vehicles, provides fully indexed fuzzy searching along with data filtering.

**Important Note:** This project is for education purposes and not production ready. It is missing basic hardening concepts like logging, global error handling, model validation, and null checks on empty filters.

**Important Note:** This project supports both Redis OSS and Redis Enterprise. For enterprise support, please use the prefix variable as seen in the docker compose.

## Getting started - Docker Compose

The easiest solution to stand up the entire stack, is via docker compose:

```bash
docker-compose up
```

Once up, you should be able to access this via postman, or http://localhost:3000/api-docs/

## Stand up just Redis

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

## Looking at the data

If you want to look through the data, i highly recommend https://resp.app/ ... it should connect via localhost no issues. 

## Configuration

Configuration is really basic. When not running in docker/docker-compose, you will need to create a `.env` file in the root of inventory-api and inventory-hydration and fill it with the following:

```
# Use for regular enviornment variables
REDIS_KEY=
REDIS_PREFIX=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB=0
REDIS_SLOTPREFIX=

# Environment type and port
NODE_ENV=development
PORT=8080
```

## Solution Structure
- inventory-api: The ExpressJS Typescript api for searching and looking up data.
- inventory-hydration: A sample hydration pipeline with full search indexes
- inventory-website: Coming soon.

## Notes

- There is a postman collection in the inventory-api folder for easy testing.
