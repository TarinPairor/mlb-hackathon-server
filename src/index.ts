// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes/api";
import userRouter from "./routes/users";
import contentLogRouter from "./routes/content-log";
import guessTheSpeedRouter from "./routes/guess-the-speed";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/users", userRouter);
app.use("/api/contentLog", contentLogRouter);
app.use("/api/guessTheSpeed", guessTheSpeedRouter);

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
