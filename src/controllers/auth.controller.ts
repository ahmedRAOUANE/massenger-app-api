import { Request, Response } from "express"
import { FailResponse, SuccessResponse } from "../types/custom-response";
import { MESSAGES } from "../utils/messages";
import { createUser, getUser } from "../services/auth.service";
import { isValidEmail } from "../utils/validations";
import { TOKEN_NAME } from "../utils/constants";

export const signup = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return new FailResponse(MESSAGES.missingData.missingNameOrEmail).send(res, 400)
        }

        const { name, email, password } = req.body;
        if (!name || name === "") {
            return new FailResponse(MESSAGES.missingData.missingName).send(res, 400)
        }
        if (!email || email === "") {
            return new FailResponse(MESSAGES.missingData.missingEmail).send(res, 400)
        }
        if (!password || password === "") {
            return new FailResponse(MESSAGES.missingData.missingPassword).send(res, 400)
        }

        if (!isValidEmail(email)) {
            return new FailResponse(MESSAGES.validation.invalidEmail).send(res, 400)
        }

        if (password.length < 6) {
            return new FailResponse(MESSAGES.validation.invalidPassword).send(res, 400);
        }

        const result = await createUser(res, { name, email, password });
        if (result instanceof FailResponse) {
            return result.send(res, 400);
        }

        // result is SuccessResponse<{token: string, user: IUser}>
        return result.send(res, 201);
    } catch (error) {
        console.log("auth controller > Erro Siging up: ", error)
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500)
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return new FailResponse(MESSAGES.missingData.missingNameOrEmail).send(res, 400)
        }

        const { password, email } = req.body;
        if (!password || password === "") {
            return new FailResponse(MESSAGES.missingData.missingPassword).send(res, 400)
        }
        if (!email || email === "") {
            return new FailResponse(MESSAGES.missingData.missingEmail).send(res, 400)
        }
        
        if (!isValidEmail(email)) {
            return new FailResponse(MESSAGES.validation.invalidEmail).send(res, 400)
        }

        const result = await getUser(res, email, password)
        if (result instanceof FailResponse) {
            return result.send(res, 400)
        }

        return result.send(res, 200);
    } catch (error) {
        console.log("auth controller > Error Getting user: ", error)
        return new FailResponse(MESSAGES.error.serverError, error).send(res, 500)
    }
}

export const logout = (_: Request, res: Response) => {
    try {
        return new SuccessResponse("user logged out successfully", null).clearCookie(res, TOKEN_NAME).send(res, 200)
    } catch (error) {
        console.log("auth controller > logout failed: ", error)
        return new FailResponse("Fail to logout", null).send(res, 500)
    }
}