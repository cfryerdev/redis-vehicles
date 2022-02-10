import { createClient } from 'redis';

console.log('Loading Vehicles ...');
import data from './_vehicles.json';

const runApplication = async () => { 
    console.log('Connecting to redis ...');
    const client = createClient({
        host: '127.0.0.1',
        port: 6379
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    console.log('Setting meta data date...');
    await client.SET('meta:date', new Date().toString());
    await client.SET(`meta:count`, data.length.toString());

    console.log('Loading data into redis...');
    const startTime = new Date();
    for (const row of data) {
        await client.SET(`data:vehicles:${row.vin}`, JSON.stringify(row, null, 4));
        await client.SADD(`sets:doors:${row.doors}`, [row.vin]);
        await client.SADD(`sets:types:${row.type}`, [row.vin]);
        await client.SADD(`sets:bodies:${row.body}`, [row.vin]);
        await client.SADD(`sets:years:${row.year}`, [row.vin]);
        await client.SADD(`sets:makes:${row.make}`, [row.vin]);
        await client.SADD(`sets:models:${row.model}`, [row.vin]);
        await client.SADD(`sets:trims:${row.trim}`, [row.vin]);
        await client.SADD(`sets:engine:fuel:${row.engine.fuel}`, [row.vin]);
        await client.SADD(`sets:engine:type:${row.engine.type}`, [row.vin]);
        await client.SADD(`sets:mpg:city:${row.mpg.city}`, [row.vin]);
        await client.SADD(`sets:mpg:highway:${row.mpg.highway}`, [row.vin]);
        await client.SADD(`composits:fuel_efficient`, [
            'sets:engine:type:Electric', 
            'sets:engine:type:3 Cylinder', 
            'sets:engine:type:4 Cylinder',
            'sets:engine:fuel:Gas/Electric Hybrid',
            'sets:engine:fuel:Flex Fuel Capability',
            'sets:engine:fuel:Electric'
        ]);
        await client.SADD(`inverses:vehicles:vin:${row.vin}`, [
            `sets:doors:${row.doors}`, 
            `sets:types:${row.type}`, 
            `sets:bodies:${row.body}`,
            `sets:years:${row.year}`,
            `sets:makes:${row.make}`,
            `sets:models:${row.model}`,
            `sets:trims:${row.trim}`,
            `sets:engine:fuel:${row.engine.fuel}`,
            `sets:engine:type:${row.engine.type}`,
            `sets:mpg:city:${row.mpg.city}`,
            `sets:mpg:highway:${row.mpg.highway}`
        ]);
    }

    const endTime = new Date();
    var timeDiff = endTime - startTime;
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);

    console.log(`Finished! (${seconds} sec)`);
    process.exit();
};

runApplication();