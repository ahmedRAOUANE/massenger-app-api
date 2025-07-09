import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";
import { FailResponse, SuccessResponse } from "../types/custom-response";
import mongoose from "mongoose";

export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

export const isValidMongooseId = (id: string) => {
    return mongoose.Types.ObjectId.isValid(id);
}

export const isValidToken = (token: string) => {
    const decodedToken = jwt.verify(token, JWT_SECRET)

    if (!decodedToken) {
        return new FailResponse("unautorized - invalid token");
    }

    return new SuccessResponse("", decodedToken);
}