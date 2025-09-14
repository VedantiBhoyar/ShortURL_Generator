import express from 'express';
import { unauthorizedException, addResponseCodeWithMessage } from './response.js';
import rateLimit from 'express-rate-limit';
import cors from 'cors';


export class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
export class ExpressApp {
    constructor(port, init) {
        this.port = port;
        this.init = init;
        this.app = express();

        this.app.disable('x-powered-by');

        this.app.use(express.json());

        this.app.use(cors({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
            exposedHeaders: ['response_code', 'response_details'],
        }));

        this.app.use(limiter);

        if (this.init) {
            this.init(this.app);
        }

        this.app.use(this.handleException);

        this.app.use((req, res) => {
            unauthorizedException(res);
        });

        this.server = this.app.listen(this.port, () => {
            const host = this.server.address();
            console.log("API server is listening at http://%s:%s", host.address, host.port);
        });
    }

    getApp() {
        return this.app;
    }

    handleException(err, req, res, next) {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            addResponseCodeWithMessage(2, res, "Bad request");
            return res.status(400).send();
        } else {
            unauthorizedException(res);
        }
    }
}
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: 'Too many requests. Try again later.'
});
