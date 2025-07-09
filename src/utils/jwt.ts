import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./constants";

const JWT_EXPIREST_IN = "7d"; // 7days

export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIREST_IN
    })
}