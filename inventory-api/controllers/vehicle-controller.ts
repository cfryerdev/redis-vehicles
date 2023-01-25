import { Express } from 'express';
import cache from '../middleware/cache-middleware';
import service from '../services/vehicle-service';

/**
 * @swagger
 * tags:
 *   - name: Vehicle
 */
export default (app: Express, client: any) => {
  
    /**
     * @swagger
     * /vehicle/{vin}:
     *    get:
     *      tags:
     *        - Vehicle
     *      summary: Returns a vehicle by vin number
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: vin
     *            description: Vehicle Vin Number
     *            in: path
     *            required: true
     *            type: string
     *      responses:
     *          200:
     *              description: An single vehicle model
     */
    app.get("/vehicle/:vin", cache(60), async (req, res) => {
        const vin = req.params.vin;
        if (vin === "") {
            res.json({});
            return;
        }
        const result = await service.getVehicleByVin(client, vin);
        res.json(result);
    });

    /**
     * @swagger
     * /vehicle/{vin}/with-attributes:
     *    post:
     *      tags:
     *        - Vehicle
     *      summary: Returns a vehicle with with attributes by vin number
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: vin
     *            description: Vehicle Vin Number
     *            in: path
     *            required: true
     *            type: string
     *          - name: attributes
     *            description: Vehicle Attributes
     *            in: body
     *            required: true
     *            type: array
     *      responses:
     *          200:
     *              description: An single vehicle model with attributes
     */
     app.post("/vehicle/:vin/with-attributes", async (req, res) => {
        const attrributes = req.body;
        const vin = req.params.vin;
        if (attrributes.length === 0 || vin === "") {
            res.json({ });
            return;
        }
        const result = await service.getVehicleAndAttributesByVin(client, vin, attrributes);
        res.json(result);
    });

    /**
     * @swagger
     * /vehicle/{vin}/select-properties:
     *    post:
     *      tags:
     *        - Vehicle
     *      summary: Returns a list of vehicles field values by vin numbers
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: vin
     *            description: Vehicle Vin Number
     *            in: path
     *            required: true
     *            type: string
     *          - name: properties
     *            description: Vehicle Properties
     *            in: body
     *            required: true
     *            type: array
     *      responses:
     *          200:
     *              description: An array of values for each field supplied
     */
     app.post("/vehicle/:vin/select-properties", async (req, res) => {
        const fields = req.body;
        const vin = req.params.vin;
        if (fields.length === 0 || vin === "") {
            res.json({ });
            return;
        }
        const result = await service.getVehicleFieldsByVin(client, vin, fields);
        res.json(result);
    });

    /**
     * @swagger
     * /vehicle/list:
     *    post:
     *      tags:
     *        - Vehicle
     *      summary: Returns a list of vehicles by vin numbers
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: vins
     *            description: Vehicle Vin Numbers
     *            in: body
     *            required: true
     *            type: array
     *      responses:
     *          200:
     *              description: An array of vehicles
     */
     app.post("/vehicle/list", async (req, res) => {
        const vins = req.body;
        if (vins.length === 0) {
            res.json({ count: 0, results: [] });
            return;
        }
        const result = await service.getVehiclesByVins(client, vins);
        res.json(result);
    });
};
