const puppeteer = require("puppeteer");
const Scrape = require('../models/Scrape');
const getQuotes = async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C://chrome-win/chrome.exe',
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0)
  await page.goto("https://www.cnet.com/cnet-zero/");

  await page.waitForTimeout(50000);

  let results = [];
  let data = [];
  let lastPageNumber = 3;

  for (let j = 0; j < lastPageNumber; j++) {
    if (j !== lastPageNumber - 1) {
      await page.click('div.c-premiumList_load_more');
      await page.waitForTimeout(5000);
    }
  }

  results = results.concat(await extractedEvaluateCall(page));

  for (let i = 0; i < results.length; i++) {

    console.log(results[i].url);
    const nextUrl = results[i].url;

    if (nextUrl.search('videos') == -1 && nextUrl.search('tech') == -1) {
      await page.goto(results[i].url);
      await page.waitForTimeout(5000);
      const article = await getArticles(page);

      const insertData = {
        date: results[i].date,
        title: results[i].title,
        content: results[i].content,
        article: article.article,
        url: results[i].url
      }
      data.push(insertData);
      const item = new Scrape(insertData);
      await item.save();
    }
  }

  await browser.close();
};

async function extractedEvaluateCall(page) {
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.c-premiumList div.c-premiumList_item");

    return Array.from(quoteList).map((quote) => {
      const url = quote.querySelector("h3.c-premiumList_link a").href;
      const title = quote.querySelector("h3.c-premiumList_link a").innerText;
      const content = quote.querySelector("p.c-premiumList_desc").innerText;
      const date = quote.querySelector("div.c-premiumList_time").innerText;

      return { url, title, content, date };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('div.c-pageArticle');

  let article = '';

  try {
    article = await page.$eval("div.c-pageArticle", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

async function getArticlesTech(page) {
  await page.waitForSelector('article#article-body');

  let article = '';

  try {
    article = await page.$eval("article#article-body", el => el.innerText);
  } catch (e) {

  }
  return { article }
}

module.exports= {
  start_cnet_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};
