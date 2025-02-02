import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { HomeRunEntry } from "../types/types";

dotenv.config();

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Api Route Working" });
});

router.get("/getSampleOf2024MLBHomeRuns", (req: Request, res: Response) => {
  const { length } = req.query;
  const results: HomeRunEntry[] = [];
  const filePath = path.join(__dirname, "../data/2024-mlb-homeruns.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      if (results.length < Number(length || 1)) {
        results.push(data);
      }
    })
    .on("end", () => {
      res.json(results);
    });
});

router.get(
  "/getSingleEntryFrom2024MLBHomeRuns",
  (req: Request, res: Response) => {
    const { idx } = req.query;
    const results: HomeRunEntry = {} as HomeRunEntry;
    const filePath = path.join(__dirname, "../data/2024-mlb-homeruns.csv");
    let currentIndex = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: HomeRunEntry) => {
        if (currentIndex === Number(idx)) {
          Object.assign(results, data);
        }
        currentIndex++;
      })
      .on("end", () => {
        res.json(results);
      });
  }
);

router.get(
  "/getRandomEntryFrom2024MLBHomeRuns",
  (req: Request, res: Response) => {
    const results: HomeRunEntry = {} as HomeRunEntry;
    const filePath = path.join(__dirname, "../data/2024-mlb-homeruns.csv");
    const entries: HomeRunEntry[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: HomeRunEntry) => {
        entries.push(data);
      })
      .on("end", () => {
        const randomIndex = Math.floor(Math.random() * entries.length);
        Object.assign(results, entries[randomIndex]);
        res.json(results);
      });
  }
);

router.get("/getRandomMLBHomeRun", (req: Request, res: Response) => {
  const results: HomeRunEntry = {} as HomeRunEntry;
  const filePath = path.join(__dirname, "../data");
  const files = fs.readdirSync(filePath);
  const randomFile = files[Math.floor(Math.random() * files.length)];
  const randomFilePath = path.join(filePath, randomFile);
  const entries: HomeRunEntry[] = [];
  fs.createReadStream(randomFilePath)
    .pipe(csv())
    .on("data", (data: HomeRunEntry) => {
      entries.push(data);
    })
    .on("end", () => {
      const randomIndex = Math.floor(Math.random() * entries.length);
      Object.assign(results, entries[randomIndex]);
      res.json(results);
    });
});

router.get("/getRandomMLBHomeRuns", (req: Request, res: Response) => {
  const { length } = req.query;
  const results: HomeRunEntry[] = [];
  const filePath = path.join(__dirname, "../data");
  const files = fs.readdirSync(filePath);
  const randomFile = files[Math.floor(Math.random() * files.length)];
  const randomFilePath = path.join(filePath, randomFile);
  const entries: HomeRunEntry[] = [];
  fs.createReadStream(randomFilePath)
    .pipe(csv())
    .on("data", (data: HomeRunEntry) => {
      if (results.length < Number(length || 1)) {
        results.push(data);
      }
    })
    .on("end", () => {
      const randomIndex = Math.floor(Math.random() * entries.length);
      Object.assign(results, entries[randomIndex]);
      res.json(results);
    });
});

export default router;
