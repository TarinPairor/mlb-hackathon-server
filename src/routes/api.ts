import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Api Route Working" });
});

export default router;
