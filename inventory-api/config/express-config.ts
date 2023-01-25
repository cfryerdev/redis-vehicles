import express from "express";
import cors from 'cors';
import { nanoid } from 'nanoid';
import compression from 'compression';

const useExpress = (): express.Express  => {
    const app = express();
    app.set("trust proxy", 1);
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(compression({ filter: shouldCompress }))
    nanoid();
    return app;
};

const shouldCompress = (req: any, res: any) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
};

export default useExpress;