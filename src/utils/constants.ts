import "dotenv/config"

export const TOKEN_NAME = "massenger_auth_token";
export const JWT_SECRET = process.env.RANDOM_JWT_SECRET!;
export const MDB_URI = process.env.MDB_URI!;
export const STREAM_KEY = process.env.STREAM_KEY!
export const STREAM_SECRET_KEY = process.env.STREAM_SECRET_KEY!