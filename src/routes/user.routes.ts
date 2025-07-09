import { Router, Request, Response } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { acceptFreindRequest, getFreinds, getFriendRequests, getProfile, getRecommendedUsers, rejectFreindRequest, sendFreindRequest } from "../controllers/user.controller";

const router = Router();

router.use((req: Request, res: Response, next) => { protectRoute(req, res, next) })

router.get("/", (req: Request, res: Response) => {
    getRecommendedUsers(req, res);
});
router.get("/me", (req: Request, res: Response) => {
    getProfile(req, res);
})
router.get("/freinds", (req: Request, res: Response) => {
    getFreinds(req, res)
})
router.post("/freinds/:id", (req: Request, res: Response) => {
    sendFreindRequest(req, res)
})
router.put("/freinds/:id/accept", (req: Request, res: Response) => {
    acceptFreindRequest(req, res)
})
router.put("/freinds/:id/reject", (req: Request, res: Response) => {
    rejectFreindRequest(req, res)
})
router.put("/freind-requests", (req: Request, res: Response) => {
    getFriendRequests(req, res)
})

export default router;
