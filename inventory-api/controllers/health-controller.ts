import { Express } from 'express';

/**
 * @swagger
 * tags:
 *   - name: Health
*/
export default (app: Express, client: any) => {

    /**
     * @swagger
     * /health:
     *    get:
     *      tags:
     *        - Health
     *      summary: Returns a 200 if the service functions
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Empty
     */
    app.get('/health', async (req, res) => {
        res.json({});
    });

    /**
     * @swagger
     * /health/redis:
     *    get:
     *      tags:
     *        - Health
     *      summary: Returns a 200 if redis is connected and redis server information
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Redis server information
     */
     app.get('/health/redis', async (req, res) => {
        var info = await client.INFO();
        res.send(info);
    });
  
};
