import mcache from 'memory-cache';

const cache = (seconds: number) => {
    return (req: any, res: any, next: Function) => {
        res.setHeader('Content-Type', 'application/json');
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body: any) => {
                mcache.put(key, body, seconds * 1000);
                res.sendResponse(body);
            }
            next();
        }
    };
};

export default cache;
