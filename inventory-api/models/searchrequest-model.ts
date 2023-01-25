/**
 * @swagger
 * definitions:
 *   SearchRequest:
 *     properties:
 *       pageSize:
 *         type: number
 *       page:
 *         type: number
 *       text:
 *         type: string
 *       facets:
 *         type: SearchFacets[]
 */

export type SearchRequest = {
    pageSize: number;
    page: number;
    text: string;
    facets: SearchRequestFacets[];
};

/**
 * @swagger
 * definitions:
 *   SearchRequestFacets:
 *     properties:
 *       name:
 *         type: string
 *       values:
 *         type: string[]
 */

export type SearchRequestFacets = {
    name: string;
    values: string[];
};