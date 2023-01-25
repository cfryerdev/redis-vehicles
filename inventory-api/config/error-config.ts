import express from "express";
import HandledResponse, { ErrorType } from "../models/errors-model";

const UseErrorHandling = (app: express.Express) =>
    new Promise((resolve, reject) => {
        try {
            const ERROR_MESSAGE_GENERIC = "An error occurred. See body for details.";
            const includeStack = process.env.NODE_ENV !== "production";
            app.use((err: any, req: any, res: any, next: Function) => {
                if (!err.errorType || err.errorType === ErrorType.SERVICE) {
                    console.error(err.stack.red);
                } else {
                    console.warn(err.stack.yellow);
                }
                return res
                    .status(err.errorType || ErrorType.SERVICE)
                    .send(new HandledResponse(ERROR_MESSAGE_GENERIC, err, includeStack));
            });
            resolve(app);
        } catch (err) {
            reject(err);
        }
    });

export default UseErrorHandling;
