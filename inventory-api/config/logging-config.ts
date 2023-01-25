import express from 'express';
import winston from 'winston';
import morgan from 'morgan';

const UseLogging = (app: express.Express) =>
    new Promise((resolve, reject) => {
        try {
            app.use(morgan((tokens: any, req: any, res: any) => {
                const method = tokens.method(req, res);
                const status = tokens.status(req, res);
                const url = tokens.url(req, res);
                const respTime = tokens["response-time"](req, res);
                return `${method} ${status} - ${url} - ${respTime}ms`;
            }));
            app.prototype.logger = winston.createLogger({
                level: "info",
                format: winston.format.json(),
                defaultMeta: {
                    service: "inventory-api"
                },
                transports: [
                    new winston.transports.Console()
                    // new winston.transports.File({
                    //     filename: './logs/zeroslope.errors.log',
                    //     level: 'error'
                    // }),
                    // new winston.transports.File({
                    //     filename: './logs/zeroslope.log'
                    // }),
                ]
            });
            resolve(app);
        } catch (err) {
            reject(err);
        }
    });

export default UseLogging;
