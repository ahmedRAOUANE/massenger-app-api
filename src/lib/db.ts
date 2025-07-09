import mongoose from "mongoose";
import { MDB_URI } from "../utils/constants";

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(MDB_URI)
        console.log(`DB connected: ${conn.connection.host}`)
    } catch (err) {
        console.log("DB Connection > Error: ", err)
        process.exit(1);
    }
}