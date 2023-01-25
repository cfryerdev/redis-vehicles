import { Express } from 'express';
import cache from '../middleware/cache-middleware';
import service from '../services/search-service';

/**
 * @swagger
 * tags:
 *   - name: Search
 */
export default (app: Express, client: any) => {

    /**
     * @swagger
     * /search:
     *    post:
     *      tags:
     *        - Search
     *      summary: Returns a list of available vehicle summaries based on search criteria
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: Search Filters
     *            in: body
     *            required: true
     *      responses:
     *          200:
     *              description: A list of vehicles based on your post body
     */
    app.post('/search', async (req, res) => {
        if (req.body.facets === undefined || req.body.text === undefined) {
            res.status(400).json({ message: 'You must supply a valid search payload.' });
            return;
        }
        const result = await service.search(client, req.body);
        res.json(result);
    });

    /**
     * @swagger
     * /search/text/{text}:
     *    get:
     *      tags:
     *        - Search
     *      summary: Returns 10 available vehicle summaries based on search criteria
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: text
     *            description: Text
     *            in: path
     *            required: true
     *            type: string
     *      responses:
     *          200:
     *              description: A list of vehicles based on your post body
     */
     app.get('/search/text/:text', cache(60), async (req, res) => {
        const text = req.params.text;
        if (text === '') {
            res.status(400).json({ message: 'You must supply some search text.' });
            return;
        }
        const result = await service.textSearch(client, text);
        res.json(result);
    });

    /**
     * @swagger
     * /search/text/{text}/{pageSize}/{page}:
     *    get:
     *      tags:
     *        - Search
     *      summary: Returns a list of available vehicle summaries based on search criteria
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: text
     *            description: Text
     *            in: path
     *            required: true
     *            type: string
     *          - name: pageSize
     *            description: Page Size
     *            in: path
     *            required: false
     *            type: number
     *          - name: page
     *            description: Page
     *            in: path
     *            required: false
     *            type: number
     *      responses:
     *          200:
     *              description: A list of vehicles based on your post body
     */
    app.get('/search/text/:text/:pageSize/:page', cache(60), async (req, res) => {
        const text = req.params.text;
        if (text === '') {
            res.status(400).json({ message: 'You must supply some search text.' });
            return;
        }
        const result = await service.textSearchSkipTake(
            client,
            text,
            parseInt(req.params.pageSize) || 10,
            parseInt(req.params.page) || 1);
        res.json(result);
    });

    /**
     * @swagger
     * /search/facets:
     *    get:
     *      tags:
     *        - Search
     *      summary: Returns a list of available search facets
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of facets
     */
    app.get('/search/facets', cache(60), async (req, res) => {
        const result = await service.facets(client);
        res.json(result);
    });

    /**
   * @swagger
   * /search/facets/{key}:
   *    get:
   *      tags:
   *        - Search
   *      summary: Returns an array of facet members by facets key
   *      produces:
   *          - application/json
   *      parameters:
   *          - name: key
   *            description: Facet Key
   *            in: path
   *            required: true
   *            type: string
   *      responses:
   *          200:
   *            description: Array of facet members
  */
    app.get('/search/facets/:key', cache(60), async (req, res) => {
        const key = req.params.key;
        if (key === "") {
            res.status(400).json({ message: 'You must supply a facet key.' });
            return;
        }
        const result = await service.facetKeys(client, key);
        res.json(result);
    });

};
