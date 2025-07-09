import { Request, Response } from "express";
import { FailResponse } from "../types/custom-response";
import { isValidToken } from "../utils/validations";
import User, { IUser } from "../models/user.model";
import { PublicData } from "../types/public-data";
import { TOKEN_NAME } from "../utils/constants";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: () => void) => {
    try {
        const token = req.cookies[TOKEN_NAME];

        if (!token) {
            return new FailResponse("unautorized - no token provided").send(res, 401);
        }
        
        const result = isValidToken(token);
        if (!result.success || result instanceof FailResponse) {
            return new FailResponse("unautorized - invalid token").send(res, 401);
        }
        
        const parsedToken = result.data as PublicData;
        if (!parsedToken) {
            return new FailResponse("unauthorized - token parsing failed").send(res, 401);
        }
        
        const user = await User.findById(parsedToken.id).select("-password")
        if (!user) {
            return new FailResponse("user not found").send(res, 404);
        }

        req.user = user;

        return next()
    } catch (error) {
        console.log("Error in protect routes middleware: ", error);
        return new FailResponse("Internal Server Error", error).send(res, 500)
    }
}