"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const functions_1 = require("../functions/functions");
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
router.get("/getRandomMLBHomeRuns", (req, res) => {
    const { length } = req.query;
    const results = [];
    const filePath = path_1.default.join(__dirname, "../data");
    const files = fs_1.default.readdirSync(filePath);
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const randomFilePath = path_1.default.join(filePath, randomFile);
    const entries = [];
    fs_1.default.createReadStream(randomFilePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (data) => {
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
// async function loadNewlineDelimitedJson(url: string): Promise<any[]> {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const text = await response.text();
//     const data: any[] = [];
//     text.split("\n").forEach((line) => {
//       try {
//         data.push(JSON.parse(line));
//       } catch (error) {
//         console.error(
//           `Skipping invalid JSON line: ${line} due to error: ${error}`
//         );
//       }
//     });
//     return data;
//   } catch (error) {
//     console.error(`Error downloading data: ${error}`);
//     return [];
//   }
// }
router.get("/scrapeMLBNews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleIds = yield (0, functions_1.scrapeMLBNews)(5);
        res.json(articleIds);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error scraping MLB news", error: error.message });
    }
}));
router.get("/scrapeMLBNewsArticle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    try {
        const article = yield (0, functions_1.scrapeMLBNewsArticle)(url);
        res.json(article);
    }
    catch (error) {
        res.status(500).json({
            message: "Error scraping MLB news article",
            error: error.message,
        });
    }
}));
router.get("/getArticles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { length } = req.query;
        const articleIds = yield (0, functions_1.scrapeMLBNews)(Number(length) || 5);
        const articles = yield Promise.all(articleIds.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, functions_1.scrapeMLBNewsArticle)(url);
        })));
        res.json(articles);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error scraping MLB news", error: error.message });
    }
}));
exports.default = router;
