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
  await page.goto("https://arstechnica.com/page/2/");

  await page.waitForTimeout(50000);

  let results = [];
  let data = [];

  results = results.concat(await extractedEvaluateCall(page));

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
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
    const item = new Scrape(insertData);
    await item.save();
  }

  // Close the browser
  await browser.close();
};

async function extractedEvaluateCall(page) {
  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.listing-latest ol li.article");

    return Array.from(quoteList).map((quote) => {
      const url = quote.querySelector("a").href;
      const title = quote.querySelector("header h2 a").innerText;
      const content = quote.querySelector("header p.excerpt").innerText;
      const date = quote.querySelector("p.byline time").innerText;

      return { url, title, content, date };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('article div.column-wrapper:nth-child(1)')

  let article = '';

  try {
    article += await page.$eval("article div.column-wrapper:nth-child(1)", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_ars_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};