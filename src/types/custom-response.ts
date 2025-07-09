import { CookieOptions, Response } from "express";
import { TOKEN_NAME } from "../utils/constants";

/**
 * the custome responces are not actual responses, the are more like object containers that define the 
 * shape of the data that should be returned, you can send them as responses or return them as objects
 */

type ErrorType<T> = Error | unknown | null | T
type DataType<T> = T | null
type MessageType = string | string[]

export class CustomResponse<T = unknown> {
    success: boolean;
    message: MessageType;
    // data?: DataType<T>;
    // error?: ErrorType<T>;

    constructor(success: boolean, message: MessageType, 
        // data: DataType<T>, error: ErrorType<T>
    ) {
        this.success = success;
        this.message = message;
        // this.data = data || null;
        // this.error = error || null
    }

    /**
     * sends the class instanse as an express js response
     * @param res express js Response
     * @param status numbe
     * @returns express js response
     */
    send(res: Response, status: number) {
        return res.status(status).json(this);
    }

    /**
     * converts the instanse to js plain object
     * @returns object
     */
    toObject() {
        return {
            ...this
        }
    }

    setCookie(res: Response, args: {name: string, val: string, options: CookieOptions}) {
        res.cookie(args.name, args.val, args.options)
        return this;
    }

    clearCookie(res: Response, tokenName: string) {
        res.clearCookie(tokenName);
        return this
    }
}

export class SuccessResponse<T = unknown> extends CustomResponse<T> {
    data: DataType<T>;
    constructor(message: MessageType, data: DataType<T>) {
        super(true, message);
        this.data = data;
    }
}

export class FailResponse<T = unknown> extends CustomResponse<T> {
    error: ErrorType<T>;

    constructor(message: MessageType, error?: ErrorType<T>) {
        super(false, message)
        this.error = error;
    }
}