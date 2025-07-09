import { Request, Response, Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { getStreamToken } from "../controllers/chat.controller";

const router = Router();

router.use((req: Request, res: Response, next) => {protectRoute(req, res, next)});

router.get("/token", (req: Request, res: Response) => {getStreamToken(req, res)});

export default router;