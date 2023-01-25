/**
 * @swagger
 * definitions:
 *   Vehicle:
 *     properties:
 *       vin:
 *         type: string
 *       year:
 *         type: number
 *       make:
 *         type: string
 *       model:
 *         type: string
 *       trim:
 *         type: string
 *       transmission:
 *         type: string
 *       drivetrain:
 *         type: string
 *       interiorColor:
 *         type: string
 *       exteriorColor:
 *         type: string
 *       bodyType:
 *         type: string
 *       stockNum:
 *         type: string
 *       engine:
 *         type: string
 *       mileage:
 *         type: number
 *       doors:
 *         type: number
 */
export type Vehicle = {
    vin: string;
    year: number;
    make: string;
    model: string;
    trim: string;
    transmission: string;
    drivetrain: string;
    interiorColor: string;
    exteriorColor: string;
    bodyType: string;
    stockNum: string;
    engine: string;
    mileage: number;
    doors: number;
};