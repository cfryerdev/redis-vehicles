import redisService from "./redis-service";
const slotPrefix = redisService.slotPrefix;

const vehicleService = {
    
    /**
     * Summary: Gets a single vehicle by vin
     */
    getVehicleByVin: async (client: any, vin: string) => {
        const record = await client.GET(`${slotPrefix()}json:vehicles:${vin}`);
        return JSON.parse(record);
    },

    /**
     * Summary: Gets a list of vehicles by a list of vins
     */
    getVehiclesByVins: async (client: any, vins: string[]) => {
        const vinKeys = vins.map((v: string) => `${slotPrefix()}json:vehicles:${v}`);
        const result = await client.MGET(vinKeys);
        return {
            count: result.length,
            results: result.map((r: any) => JSON.parse(r!)),
        };
    },

    /**
     * Summary: Gets specific fields on a vehicle by vin and fields
     */
    getVehicleFieldsByVin: async (client: any, vin: string, fields: string[]) => {
        let result = {};
        const values = await client.HMGET(`${slotPrefix()}fields:vehicles:${vin}`, fields);
        for (let i = 0; i < fields.length; i++) {
            // @ts-ignore
            result[fields[i]] = values[i];
        }
        return result;
    },

    /**
     * Summary: Gets a single vehicle by vin and any additional attributes by list of attribute names
     */
    getVehicleAndAttributesByVin: async (client: any, vin: string, attributes: string[]) => {
        const vehicle = await client.GET(`${slotPrefix()}json:vehicles:${vin}`);
        let model = JSON.parse(vehicle);
        for (const atr in attributes) {
            const data = await client.GET(`${slotPrefix()}json:${attributes[atr]}:${vin}`);
            model[attributes[atr]] = JSON.parse(data);
        }
        return model;
    }
};

export default vehicleService;
