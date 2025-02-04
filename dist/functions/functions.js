"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.scrapeMLBNews = scrapeMLBNews;
exports.scrapeMLBNewsArticle = scrapeMLBNewsArticle;
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
function scrapeMLBNews(limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://www.mlb.com/news");
            const html = response.data;
            const $ = cheerio.load(html);
            const links = [];
            let count = 0;
            $("article").each((_, element) => {
                if (limit && count >= limit) {
                    return;
                }
                const id = $(element).attr("id");
                if (id) {
                    links.push("https://www.mlb.com/news/" + id);
                }
                count++;
            });
            return links;
        }
        catch (error) {
            console.error(`Error scraping MLB news: ${error}`);
            return [];
        }
    });
}
function scrapeMLBNewsArticle(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            let title = $("h1").text();
            // cut title in halve because it duplicates
            title = title.slice(0, title.length / 2);
            let paragraphs = "";
            $("p").each((_, element) => {
                paragraphs += $(element).text() + " ";
            });
            let img = undefined;
            // $("img").each((_, element) => {
            //   const srcset = $(element).attr("srcset");
            //   const src = $(element).attr("src");
            //   if (srcset && srcset?.split(",").length > 1) {
            //     img.push(srcset.split(",")[0].split(" ")[0] || "");
            //   }
            // });
            return {
                title,
                //  paragraphs,
                paragraphs: "",
                img,
                url,
            };
        }
        catch (error) {
            console.error(`Error scraping MLB news article: ${error}`);
            return {};
        }
    });
}
