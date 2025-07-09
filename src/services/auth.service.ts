import { MESSAGES } from "../utils/messages";
import { FailResponse, SuccessResponse } from "../types/custom-response";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { Response } from "express";
import { TOKEN_NAME } from "../utils/constants";
import { upsertStreamUsers } from "../lib/stream";
import { UserResponse } from "stream-chat";
import { PublicData } from "../types/public-data";

interface UserCredentials {
    name: string;
    email: string;
    password: string;
}

export const createUser = async (res: Response, {name, email, password}: UserCredentials): Promise<SuccessResponse<PublicData> | FailResponse> => {
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return new FailResponse("user is already exists")
        }

        const user = await User.create({ name, email, password })
        if (!user) {
            return new FailResponse(MESSAGES.fail.creatingUser);
        }

        const publicData: PublicData = {
            id: user._id,
            email: user.email,
            name: user.name
        }

        const {success: streamSuccess} = await upsertStreamUsers(publicData as UserResponse)
        if (!streamSuccess) {
            return new FailResponse("failed to upsert stream user");
        }

        const token = generateToken(publicData);

        return new SuccessResponse(MESSAGES.success.creatingUser, publicData)
            .setCookie(res, { name: TOKEN_NAME, val: token, options: {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
                secure: process.env.NODE_ENV==="production"
            }})
    } catch (error) {
        console.log("Error Creating user > createUser service: ", error)
        return new FailResponse(MESSAGES.error.serverError, error)
    }
}

export const getUser = async (res: Response, email: string, password: string): Promise<SuccessResponse<PublicData> | FailResponse> => {
    try {
        const user = await User.findOne({email}).select("+password") as IUser
        console.log("user before pass the password to user.matchPassword: ", user)
        if (!user) {
            return new FailResponse(MESSAGES.missingData.missingUser);
        }
        
        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) {
            return new FailResponse(MESSAGES.validation.invalidPassword);
        }

        const publicData: PublicData = {
            id: user._id,
            email: user.email,
            name: user.name
        }
        
        const token = generateToken(publicData);

        return new SuccessResponse(MESSAGES.success.gettingUser, publicData)
            .setCookie(res, {
                name: TOKEN_NAME, val: token, options: {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
                    secure: process.env.NODE_ENV === "production"
                }
            });
    } catch (error) {
        console.log("Error Getting user: ", error)
        return new FailResponse(MESSAGES.error.serverError, error);
    }
}

