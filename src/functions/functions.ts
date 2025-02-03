import * as cheerio from "cheerio";
import axios from "axios";

export async function scrapeMLBNews(): Promise<string[]> {
  try {
    const response = await axios.get("https://www.mlb.com/news");
    const html = response.data;
    const $ = cheerio.load(html);
    const links: string[] = [];

    $("article").each((_, element) => {
      const id = $(element).attr("id");
      if (id) {
        links.push("https://www.mlb.com/news/" + id);
      }
    });

    return links;
  } catch (error) {
    console.error(`Error scraping MLB news: ${error}`);
    return [];
  }
}

type Article = {
  title: string;
  paragraphs: string;
  img: string[] | undefined;
};

export async function scrapeMLBNewsArticle(url: string): Promise<Article> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let title: string = $("h1").text();
    let paragraphs: string = "";
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

    return { title, paragraphs, img };
  } catch (error) {
    console.error(`Error scraping MLB news article: ${error}`);
    return {} as Article;
  }
}
