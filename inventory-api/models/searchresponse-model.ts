/**
 * @swagger
 * definitions:
 *   SearchResponse:
 *     properties:
 *       cacheKey:
 *         type: string
 *       total:
 *         type: number
 *       count:
 *         type: number
 *       results:
 *         type: SearchResult[]
 */
export type SearchResponse = {
    cacheKey: string;
    total: number;
    count: number;
    results: SearchResult[];
};

export type SearchResult = {
    
};