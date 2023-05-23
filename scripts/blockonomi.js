
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
  await page.goto("https://blockonomi.com/");

  await page.waitForTimeout(50000);

  let results = [];
  let data = [];
  let lastPageNumber = 10;

  for (let index = 0; index < lastPageNumber; index++) {
    await page.waitForTimeout(5000);
    results = results.concat(await extractedEvaluateCall(page));
    if (index !== lastPageNumber - 1) {
      await page.click('nav.main-pagination span.label-next a');
      await page.waitForTimeout(5000);
    }
  }

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
    await page.goto(results[i].url);
    await page.waitForTimeout(5000);
    const article = await getArticles(page);

    const insertData = {
      title: results[i].title,
      content: results[i].content,
      article: article.article,
      url: results[i].url
    }
    const item = new Scrape(insertData);
    await item.save();
  }

  // Close the browser
  await browser.close();

};

async function extractedEvaluateCall(page) {
  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.posts-wrap div.col-6");

    return Array.from(quoteList).map((quote) => {
      const url = quote.querySelector("div.meta-title h2 a").href;
      const title = quote.querySelector("div.meta-title h2 a").innerText;
      const content = quote.querySelector("div.post-content p").innerText;

      return { url, title, content };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('article.the-post')

  let article = '';

  try {
    article += await page.$eval("div.description", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_blockonomi_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};