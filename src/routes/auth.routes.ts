import { Request, Response, Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", (req: Request, res: Response) => {signup(req, res)})
router.post("/login", (req: Request, res: Response) => {login(req, res)})
router.post("/logout", (req: Request, res: Response) => {logout(req, res)})

export default router;