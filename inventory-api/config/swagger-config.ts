// @ts-nocheck
import { Express } from 'express';
import path from 'path';
import swaggerJsdoc  from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const UseSwagger = (app: Express) => {
    const options = {
        swaggerDefinition: { 
            info: { 
                title: "Inventory Api", 
                description: 'Inventory search api using redis and modelled after set theory concepts.'
            }
        },
        produces: ["application/json"],
        schemes: ["http", "https"],
        apis: [
            path.resolve(__dirname, "../index.ts"),
            path.resolve(__dirname, "../controllers/*.ts"),
            path.resolve(__dirname, "../models/*.ts")
        ]
    } as SwaggerDefinition;
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
};

export default UseSwagger;
