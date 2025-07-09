import app from "./app";
import "dotenv/config"
import { connectDb } from "./lib/db";

const PORT = process.env.PORT;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`)
    })
})