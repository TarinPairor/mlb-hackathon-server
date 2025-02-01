// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes/api";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
