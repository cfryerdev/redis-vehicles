import { nanoid } from 'nanoid';
import sum from 'hash-sum';
import redisService from "./redis-service";
const slotPrefix = redisService.slotPrefix;

const searchService = {
    
    /**
     * Summary: Searches inventory api for vehicles based on text and filters
     */
    search: async (client: any, requestBody: any) => {
        const cacheSearchInMinutes = 10;
        const expire = 60 * cacheSearchInMinutes;
        const fuzzyCacheKey = `${slotPrefix()}cache:textdata:${sum(requestBody.text)}`;
        const cachedResultsKey = `${slotPrefix()}cache:searchdata:${sum(requestBody.facets)}`;
        const exists = await client.EXISTS(cachedResultsKey);
        if (requestBody.text !== "") {
            await searchService.vinSearchStore(client, fuzzyCacheKey, requestBody.text, expire);
        }
        if (exists === 0 && requestBody.facets.length > 0) {
            let keys = [];
            const batch = client.multi();
            for (let i = 0; i < requestBody.facets.length; i++) {
                let unions = [];
                const filter = requestBody.facets[i];
                const cacheKeyUnion = `${slotPrefix()}cache:facetdata:${nanoid()}`;
                keys.push(cacheKeyUnion);
                for (let ii = 0; ii < filter.values.length; ii++) {
                    const kv = filter.values[ii];
                    unions.push(`${slotPrefix()}facets:${filter.name}:${kv}`);
                }
                await batch.ZUNIONSTORE(cacheKeyUnion, unions);
                await batch.EXPIRE(cacheKeyUnion, expire);
            }
            if (requestBody.text !== "") {
                keys.push(fuzzyCacheKey);
            }
            await batch.ZINTERSTORE(cachedResultsKey, keys, 'WEIGHTS', 1);
            await batch.EXPIRE(cachedResultsKey, expire);
            batch.exec();
        }
        let total = await client.ZCARD(cachedResultsKey);
        if (total > 0) {
            let skipAmount = (requestBody.page * requestBody.pageSize) - requestBody.pageSize;
            let takeAmount = (skipAmount + requestBody.pageSize) - 1;
            let vins = await client.ZRANGE(cachedResultsKey, skipAmount, takeAmount);
            const vinKeys = vins.map((v: string) => `${slotPrefix()}json:vehicles:${v}`);
            const result = await client.MGET(vinKeys);
            return {
                cacheKey: cachedResultsKey,
                total: total,
                count: result.length,
                results: result.map((r: any) => JSON.parse(r!))
            };
        }
        return { cacheKey: '', count: 0, total: 0, results: [] };
    },

    /**
     * Summary: Search facets used for search functionality.
     */
    facets: async (client: any) => {
        const record = await client.GET(`${slotPrefix()}json:facets`);
        return JSON.parse(record);
    },

    /**
     * Summary: Search facets used for search functionality. Dynamic Lookup using Scan.
     */
     facetsDynamic: async (client: any) => {
        const scan = client.scanIterator({
            MATCH: `${slotPrefix()}facets:*`,
            COUNT: 10000
        });
        let items = [];
        for await (const keys of scan) {
            let fi = keys.replace(`${slotPrefix()}facets:`, '').split(':');
            items.push(fi[0]);
        }
        console.log(items)
        return [...new Set(items)];
    },

    /**
     * Summary: Searches facet values used for search functionality
     */
    facetKeys: async (client: any, key: string) => {
        const scan = client.scanIterator({
            MATCH: `${slotPrefix()}facets:${key}:*`,
            COUNT: 1000
        });
        let items = [];
        for await (const d of scan) {
            items.push(d.replace(`${slotPrefix()}facets:${key}:`, ''));
        }
        return [...new Set(items)];
    },

    /**
     * Summary: Full text search, returns first ten records
     */
    textSearch: async (client: any, text: string) => {
        const results = await client.ft.search(`${slotPrefix()}indexes:vehicles`, text);
        return {
            cacheKey: '',
            total: results.total,
            count: results.documents.length,
            results: results.documents.map((d: any) => { return d.value; })
        };
    },

    /**
     * Summary: Full text search, returns records based on page and page size
     */
    textSearchSkipTake: async (client: any, text: string, pageSize: number, page: number) => {
        const results = await client.ft.search(`${slotPrefix()}indexes:vehicles`, text, {
            LIMIT: {
              from: page === 1 ? 0 : ((page - 1) * pageSize),
              size: pageSize
            }
        });
        return {
            cacheKey: '',
            total: results.total,
            count: results.documents.length,
            results: results.documents
        };
    },

    /**
     * Summary: Full text search, returns vin numbers based on page and page size
     */
    vinSearch: async (client: any, text: string, pageSize: number, page: number) => {
        const results = await client.ft.search(`${slotPrefix()}indexes:vehicles`, text, {
            LIMIT: {
              from: page === 1 ? 0 : ((page - 1) * pageSize),
              size: pageSize
            }
        });
        return results.documents.map((d: any) => { return d.id.replace(`${slotPrefix()}fields:vehicles:`, ''); })
    },
    
    /**
     * Summary: Full text search, stores vin numbers based on page and page size in a supplied cache key 
     */
    vinSearchStore: async (client: any, cacheKey: string, text: string, expire: number) => {
        const exists = await client.EXISTS(cacheKey);
        if (exists === 0) {
            const results = await client.ft.search(`${slotPrefix()}indexes:vehicles`, text, {
                LIMIT: {
                  from: 0,
                  size: 10000
                }
            });
            for (let i = 0; i < results.documents.length; i++) {
                const d = results.documents[i].id.replace(`${slotPrefix()}fields:vehicles:`, '');
                await client.ZADD(cacheKey, { score: i, value: d });
            }
        }
        await client.EXPIRE(cacheKey, expire);
    }
};

export default searchService;
