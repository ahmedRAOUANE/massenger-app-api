import express from "express";
import authRoutes from "./routes/auth.routes"
import homeRoutes from "./routes/home.routes"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

export default app;