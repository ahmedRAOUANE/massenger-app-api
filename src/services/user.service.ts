import { IFriendRequest } from "../models/freindRequest.model";
import User from "../models/user.model";
import { FailResponse, SuccessResponse } from "../types/custom-response";

export const acceptRequest = async (freindRequest: IFriendRequest) => {
    try {
        freindRequest.status = "accepted";
        const request = await freindRequest.save();
        if (!request) {
            return new FailResponse("Filed to accept freind request");
        }

        // add the new freind to the user's freinds array
        await User.findByIdAndUpdate(freindRequest.sender, {
            $addToSet: {freinds: freindRequest.reciver}
        })
        await User.findByIdAndUpdate(freindRequest.reciver, {
            $addToSet: {freinds: freindRequest.sender}
        })

        return new SuccessResponse("freind request accepted", request);
    } catch (error) {
        return new FailResponse("Error accepting freind request", error);
    }
}