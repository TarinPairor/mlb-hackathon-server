import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

router.post(
  "/createContentLog",
  async (req: Request, res: Response): Promise<void> => {
    const { email, watched_for, article_summary, play_id } = req.body;
    const { data, error } = await supabase
      .from("mlb_content_log")
      .insert([{ email, watched_for, article_summary, play_id }]);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(201).json(data);
  }
);

export default router;
