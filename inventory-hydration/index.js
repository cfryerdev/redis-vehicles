import { SchemaFieldTypes } from 'redis';
import * as dotenv from 'dotenv';
import UseRedis from './config/redis-config.js';
import datasource from './data/database.json' assert { type: 'json' };;

/* ===================================================== */

/**
 * Summary: Data loader entry point.
 */
const main = async (client) => { 
    const startTime = new Date();
    await flushDatabase(client);
    await handleIndexes(client);
    await handleFacetList(client);
    console.log(`-- Loading ${datasource.length} records into redis...`);
    for (let row of datasource) {
        const batch = client.multi();
        await handleJson(batch, row);
        await handleSets(batch, row);
        await handleFields(batch, row);
        await handleRanges(batch, row);
        await handleInverses(batch, row);
        await handleFacetValues(batch, row);
        await batch.exec();
    }
    var timeDiff = new Date() - startTime;
    timeDiff /= 1000;
    return Math.round(timeDiff);
};

/**
 * Summary: Flushes the database before loading.
 */
const flushDatabase = async (client) => {
    console.log('-- Flushing database...');
    await client.FLUSHDB();
};

/**
 * Summary: Gets a optional slot prefix, for use with redis enterprise.
 */
const slotPrefix = () => {
    if (process.env.REDIS_SLOTPREFIX && process.env.REDIS_SLOTPREFIX !== '') {
        return `{${process.env.REDIS_SLOTPREFIX}}:`;
    }
    return '';
};

/**
 * Summary: Handles creating sets that store json data.
 */
const handleJson = async (batch, row) => {
    var v = {...row};
    delete v.options; delete v.location; delete v.sale; delete v.notes;
    await batch.SET(`${slotPrefix()}json:vehicles:${row.vin}`, JSON.stringify(v));
    await batch.SET(`${slotPrefix()}json:notes:${row.vin}`, JSON.stringify(row.notes));
    await batch.SET(`${slotPrefix()}json:options:${row.vin}`, JSON.stringify(row.options));
    await batch.SET(`${slotPrefix()}json:locations:${row.vin}`, JSON.stringify(row.location));
    await batch.SET(`${slotPrefix()}json:sales:${row.vin}`, JSON.stringify(row.sale));
};

/**
 * Summary: Handles creating sets that are for specific purposes.
 */
const handleSets = async (batch, row) => {
    if (row.sale.date != null) {
        var future = new Date();
        var today = new Date();
        future.setDate(future.getDate() + 30);
        var sale = new Date(row.sale.date);
        if (sale <= future && sale >= today) {
            await batch.SADD(`${slotPrefix()}sets:futureauctions`, [row.vin]);
        }
    }
};

/**
 * Summary: Handles creating hash sets used for field value lookups.
 */
const handleFields = async (batch, row) => {
    const propsToSkip = ['options', 'location', 'sale', 'notes'];
    for (const prop in row) {
        if (!propsToSkip.includes(prop)) {
            await batch.HSET(`${slotPrefix()}fields:vehicles:${row.vin}`, prop, `${row[prop]}` || '');
        }
    }
    await batch.HSET(`${slotPrefix()}fields:vehicles:${row.vin}`, 'price', `${row.sale.price}`);
    if (row.location !== null) {
        for (const prop in row) {
            await batch.HSET(`${slotPrefix()}fields:locations:${row.location.id}`, prop, `${row[prop]}` || '');
        }
    }
};

/**
 * Summary: Handles creating sorted sets used for search ranges.
 */
const handleRanges = async (batch, row) => {
    if (row.sale.date != null) {
        const unixTimestamp = Math.floor(new Date(row.sale.date).getTime() / 1000);
        await batch.ZADD(`${slotPrefix()}ranges:date`, { score: unixTimestamp, value: row.vin });
    }
    row.sale.price != null && await batch.ZADD(`${slotPrefix()}ranges:price`, { score: row.sale.price, value: row.vin });
};

/**
 * Summary: Handles creating inverse sets used for determining relationships between data.
 */
const handleInverses = async (batch, row) => {
    for (const a of row.options) {
        await batch.SADD(`${slotPrefix()}inverse:options:${a.trim()}`, [`${slotPrefix()}json:vehicles:${row.vin}`]);
    }
    for (const a of row.notes) {
        await batch.SADD(`${slotPrefix()}inverse:notes:${a.trim()}`, [`${slotPrefix()}json:vehicles:${row.vin}`]);
    }
    if (row.location !== null) {
        await batch.SADD(`${slotPrefix()}inverse:locations:${row.location.id}`, [`${slotPrefix()}json:vehicles:${row.vin}`]);
    }
};

/**
 * Summary: Handles creating a set used for listing available facets.
 */
 const handleFacetList = async (client) => {
    await client.SET(`${slotPrefix()}json:facets`, JSON.stringify([
        { "key": "years", "name": "Year"},
        { "key": "makes", "name": "Make"},
        { "key": "models", "name": "Model"},
        { "key": "trims", "name": "Trim"},
        { "key": "doors", "name": "Doors"},
        { "key": "bodies", "name": "Body"},
        { "key": "transmissions", "name": "Transmission"},
        { "key": "engines", "name": "Engine"},
        { "key": "drivetrain", "name": "Drivetrain"},
        { "key": "interior_colors", "name": "Interior Color"},
        { "key": "exterior_colors", "name": "Exterior Color"},
        { "key": "state", "name": "Location"},
        { "key": "date", "name": "Sale Date"}
    ]));
};

/**
 * Summary: Handles creating sets used for union and intersections to locate results and relationships.
 */
const handleFacetValues = async (batch, row) => {
    await batch.SADD(`${slotPrefix()}facets:years:${row.year}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:makes:${row.make}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:models:${row.model}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:trims:${row.trim}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:doors:${row.doors}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:bodies:${row.body}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:transmissions:${row.transmission}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:engines:${row.engine}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:drivetrain:${row.drivetrain}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:interior_colors:${row.interior_color}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:exterior_colors:${row.exterior_color}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:state:${row.location.state}`, [row.vin]);
    await batch.SADD(`${slotPrefix()}facets:date:${row.sale.date !== null ? new Date(row.sale.date).toLocaleDateString('fr-CA') : "Unlisted"}`, [row.vin]);
};

/**
 * Summary: Handles creating indexes used to drive fuzzy search functionality.
 */
const handleIndexes = async (client) => {
    console.log('-- Creating search index...');
    const indexes = {
        'price': { type: SchemaFieldTypes.NUMERIC, AS: 'price', sortable: true },
        'mileage': { type: SchemaFieldTypes.NUMERIC, AS: 'mileage', sortable: true },
        'year': { type: SchemaFieldTypes.TEXT, AS: 'year', sortable: true },
        'make': { type: SchemaFieldTypes.TEXT, AS: 'make' },
        'model': { type: SchemaFieldTypes.TEXT, AS: 'model' },
        'trim': { type: SchemaFieldTypes.TEXT, AS: 'trim' },
        'transmission': { type: SchemaFieldTypes.TEXT, AS: 'transmission' },
        'drivetrain': { type: SchemaFieldTypes.TEXT, AS: 'drivetrain' },
        'body': { type: SchemaFieldTypes.TEXT, AS: 'body' }
    };
    await client.ft.create(`${slotPrefix()}indexes:vehicles`, indexes, { ON: 'HASH', PREFIX: `${slotPrefix()}fields:vehicles` });
};

/* ===================================================== */

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

UseRedis().then(client => {
    console.log(`-- Starting hydration.`);
    main(client)
        .then(seconds => {
            console.log(`-- Finished! (${seconds} sec)`);
            process.exit(0);
        });
});