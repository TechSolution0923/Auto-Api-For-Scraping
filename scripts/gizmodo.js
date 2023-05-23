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

  // await page.setDefaultNavigationTimeout(0)
  await page.goto("https://gizmodo.com/tech/news", { waitUntil: "load", timeout: 0 });

  let results = [];
  let data = [];
  let lastPageNumber = 5;

  await page.waitForTimeout(50000);
  for (let index = 0; index < lastPageNumber; index++) {
    results = results.concat(await extractedEvaluateCall(page));
    if (index !== lastPageNumber - 1) {
      await page.click('a.next-button');
      await page.waitForTimeout(5000);
    }
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i].url && results[i].title && results[i].content && results[i].date) {
      await page.goto(results[i].url, { waitUntil: "load", timeout: 0 });
      const article = await getArticles(page);

      const insertData = {
        date: results[i].date,
        title: results[i].title,
        article: article.article,
        url: results[i].url
      }
      const item = new Scrape(insertData);
      await item.save();
      data.push(insertData);
    }
  }

  // Close the browser
  await browser.close();
};

async function extractedEvaluateCall(page) {
  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("main article.js_post_item");

    return Array.from(quoteList).map((quote) => {
      const url = quote.querySelector("div.dYIPCV a").href;
      const title = quote.querySelector("div.dYIPCV a h2").innerText;
      const content = quote.querySelector("div.hSViKw p").innerText;
      const date = quote.querySelector("time").innerText;

      return { url, title, content, date };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('main div.js_post-content')

  let article = '';

  try {
    article = await page.$eval("main div.js_post-content", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_gizmodo_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};