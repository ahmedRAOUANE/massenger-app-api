import { StreamChat, UserResponse } from "stream-chat";
import { STREAM_KEY, STREAM_SECRET_KEY } from "../utils/constants";
import { FailResponse, SuccessResponse } from "../types/custom-response";
import { MESSAGES } from "../utils/messages";

export const streamClient = StreamChat.getInstance(STREAM_KEY, STREAM_SECRET_KEY)

export const upsertStreamUsers= async (userData: UserResponse): Promise<SuccessResponse<UserResponse> | FailResponse> => {
    try {
        const result = await streamClient.upsertUsers([userData])
        const upsertedUser = result.users?.[userData.id];
        if (!upsertedUser) {
            return new FailResponse("failed to create new stream user");
        }

        return new SuccessResponse<UserResponse>("upsertStreamUser > user created successfully", upsertedUser)
    } catch (error) {
        console.error("Stream user upsert failed:", error);
        return new FailResponse("failed to create new stream user", error);
    }
}

// TODO: Create generateStreamToken function
export const generateStreamToken = (id: string) => {
    try {
        const idStr = id.toString();
        const token = streamClient.createToken(idStr);
        if (!token) {
            return new FailResponse("unable to generate stream token")
        } 

        return new SuccessResponse("stream token", token)
    } catch (error) {
        console.log("Error Generating Stream Token: ", error);
        return new FailResponse(MESSAGES.error.serverError)
    }
}