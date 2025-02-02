"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({ message: "Api Route Working" });
});
router.get("/getSampleOf2024MLBHomeRuns", (req, res) => {
    const results = [];
    const filePath = path_1.default.join(__dirname, "../data/2024-mlb-homeruns.csv");
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        if (results.length < 10) {
            results.push(data.video);
        }
    })
        .on("end", () => {
        res.json(results);
    });
});
exports.default = router;
