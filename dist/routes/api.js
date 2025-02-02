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
    const { length } = req.query;
    const results = [];
    const filePath = path_1.default.join(__dirname, "../data/2024-mlb-homeruns.csv");
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        if (results.length < Number(length || 1)) {
            results.push(data);
        }
    })
        .on("end", () => {
        res.json(results);
    });
});
router.get("/getSingleEntryFrom2024MLBHomeRuns", (req, res) => {
    const { idx } = req.query;
    const results = {};
    const filePath = path_1.default.join(__dirname, "../data/2024-mlb-homeruns.csv");
    let currentIndex = 0;
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        if (currentIndex === Number(idx)) {
            Object.assign(results, data);
        }
        currentIndex++;
    })
        .on("end", () => {
        res.json(results);
    });
});
router.get("/getRandomEntryFrom2024MLBHomeRuns", (req, res) => {
    const results = {};
    const filePath = path_1.default.join(__dirname, "../data/2024-mlb-homeruns.csv");
    const entries = [];
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        entries.push(data);
    })
        .on("end", () => {
        const randomIndex = Math.floor(Math.random() * entries.length);
        Object.assign(results, entries[randomIndex]);
        res.json(results);
    });
});
router.get("/getRandomMLBHomeRun", (req, res) => {
    const results = {};
    const filePath = path_1.default.join(__dirname, "../data");
    const files = fs_1.default.readdirSync(filePath);
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const randomFilePath = path_1.default.join(filePath, randomFile);
    const entries = [];
    fs_1.default.createReadStream(randomFilePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
        entries.push(data);
    })
        .on("end", () => {
        const randomIndex = Math.floor(Math.random() * entries.length);
        Object.assign(results, entries[randomIndex]);
        res.json(results);
    });
});
exports.default = router;
