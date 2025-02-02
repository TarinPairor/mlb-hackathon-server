import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

dotenv.config();

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Api Route Working" });
});

router.get("/getSampleOf2024MLBHomeRuns", (req: Request, res: Response) => {
  const results: string[] = [];
  const filePath = path.join(__dirname, "../data/2024-mlb-homeruns.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      if (results.length < 10) {
        results.push(data.video);
      }
    })
    .on("end", () => {
      res.json(results);
    });
});

export default router;
