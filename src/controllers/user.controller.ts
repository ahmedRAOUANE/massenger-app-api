import { Request, Response } from "express";
import User from "../models/user.model";
import { FailResponse, SuccessResponse } from "../types/custom-response";
import { MESSAGES } from "../utils/messages";
import FreindRequest from "../models/freindRequest.model";
import { isValidMongooseId } from "../utils/validations";
import { acceptRequest } from "../services/user.service";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return new FailResponse("unautorized - user not found").send(res, 401);
        }
        return new SuccessResponse("user profile", user).send(res, 200);
    } catch (error) {
        console.log("user controller > getProfile Error: ", error)
        return new FailResponse(MESSAGES.error.serverError).send(res, 500);
    }
} 

export const getRecommendedUsers = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return new FailResponse("no user have been found").send(res, 400)
        }

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUser.id}},
                {_id: {$nin: currentUser.freinds}}
            ]
        })

        return new SuccessResponse("Recommended Users", recommendedUsers).send(res, 200);
    } catch (error) {
        console.log("user controller > Error Getting Recommended Users: ", error);
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500);
    }
}

export const getFreinds = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return new FailResponse("no current user have been found").send(res, 404)
        }
        
        const user = await User.findById(currentUser.id)
        .select("freinds")
        .populate("freinds", "name email")
        
        if (!user) {
            return new FailResponse("no user have been found").send(res, 404)
        }

        return new SuccessResponse("user freinds", user.freinds).send(res, 200)
    } catch (error) {
        console.log("user controller > Error Getting Freinds: ", error);
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500);
    }
}

export const sendFreindRequest = async (req: Request, res: Response) => {
    try {
        const senderId = req.user?.id;
        const reciverId = req.params.id;

        if (
            !senderId ||
            !reciverId ||
            !isValidMongooseId(senderId) ||
            !isValidMongooseId(reciverId)
        ) {
            return new FailResponse("senderId or reciverId is missing or invalid").send(res, 400);
        }

        if (senderId === reciverId) {
            return new FailResponse("you can not send request to yourself").send(res, 400);
        }

        const reciver = await User.findById(reciverId);
        if (!reciver) {
            return new FailResponse("no reciver have been found").send(res, 404);
        }

        if (reciver.freinds.includes(senderId)) {
            return new FailResponse("you are already freinds").send(res, 400);
        }

        const existentRequest = await FreindRequest.findOne({
            $or: [
                {sender: senderId, reciver: reciverId},
                {sender: reciverId, reciver: senderId},
            ]
        })
        if (existentRequest) {
            return new FailResponse("friend request is already exists").send(res, 400);
        }

        const newFreindRequest = FreindRequest.create({
            sender: senderId,
            reciver: reciverId
        });
        if (!newFreindRequest) {
            return new FailResponse("failed to send freind request").send(res, 401)
        }

        return new SuccessResponse(`freind request have been sent to ${reciver.name}`, null).send(res, 201);
    } catch (error) {
        console.log("user controller > sending freind request error: ", error);
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500);
    }
} 

export const acceptFreindRequest = async (req: Request, res: Response) => {
    try {
        const requestId = req.params.id;
        if (!requestId || !isValidMongooseId(requestId)) {
            return new FailResponse("requestId is missing or invalid").send(res, 400);
        }

        const freindRequest = await FreindRequest.findById(requestId)
        if (!freindRequest) {
            return new FailResponse("no freind request found").send(res, 404);
        }

        // verify the current user is the reciver
        if (freindRequest.reciver.toString() !== req.user?.id) {
            return new FailResponse("you are unauthorized to accept this request").send(res, 403);
        }

        if (freindRequest.status === "accepted") {
            return new FailResponse("This friend request is already accepted").send(res, 409);
        }

        const result = await acceptRequest(freindRequest)
        if (result instanceof FailResponse) {
            return result.send(res, 500);
        }

        return result.send(res, 200)
    } catch (error) {
        console.log("user controller > accepting Freind Request: ", error);
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500);
    }
}

export const rejectFreindRequest = async (req: Request, res: Response) => {}

export const getFriendRequests = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return new FailResponse("unauthorized").send(res, 401);
        }

        const status = (req.query.status as string) || "all";
        const direction = (req.query.direction as string) || "all";

        const validStatuses = ["pending", "accepted", "all"];
        const validDirections = ["incoming", "outgoing", "all"];

        if (!validStatuses.includes(status)) {
            return new FailResponse("invalid status filter").send(res, 400);
        }

        if (!validDirections.includes(direction)) {
            return new FailResponse("invalid direction filter").send(res, 400);
        }

        const filters: Record<string, any> = {};
        if (status !== "all") {
            filters.status = status;
        }

        const results: Record<string, any[]> = {};

        const populateFields = "name email";

        if (direction === "incoming" || direction === "all") {
            const incomingReqs = await FreindRequest.find({
                ...filters,
                reciver: user.id
            }).populate("sender", populateFields);
            results.incoming = incomingReqs;
        }

        if (direction === "outgoing" || direction === "all") {
            const outgoingReqs = await FreindRequest.find({
                ...filters,
                sender: user.id
            }).populate("reciver", populateFields);
            results.outgoing = outgoingReqs;
        }

        return new SuccessResponse("friend requests fetched", results).send(res, 200);
    } catch (error) {
        console.log("User controller > error getting friend requests: ", error);
        return new FailResponse(MESSAGES.error.serverError).send(res, 500);
    }
};

