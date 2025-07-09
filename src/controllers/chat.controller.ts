import { Request, Response } from "express";
import { FailResponse, SuccessResponse } from "../types/custom-response";
import { MESSAGES } from "../utils/messages";
import { generateStreamToken } from "../lib/stream";

export const getStreamToken = (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) {
            return new FailResponse("user id is missing or invalid").send(res, 400);
        }

        const result = generateStreamToken(id);
        if (result instanceof FailResponse) {
            return result.send(res, 500);
        }

        return result.send(res, 200)
    } catch (error) {
        console.log("chat controller > getStreamToken: ", error);
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500);
    }
}