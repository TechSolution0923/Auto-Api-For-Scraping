
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

  await page.goto("https://www.marketwatch.com/latest-news", { waitUntil: "load", timeout: 0 });

  let results = [];
  let data = [];
  let lastPageNumber = 5;

  await page.waitForTimeout(50000);
  for (let index = 0; index < lastPageNumber; index++) {
    await page.click('button.js--more-headlines');
    await page.waitForTimeout(5000);
  }

  results = results.concat(await extractedEvaluateCall(page));

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
    if (results[i].url && results[i].title && results[i].date) {
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
    const quoteList = document.querySelectorAll("div.collection__elements div.element--article");

    return Array.from(quoteList).map((quote) => {
      let url = '', title = '', date = '';
      try {
        date = quote.querySelector("div.article__details span.article__timestamp").innerText;
      } catch (e) {

      }
      try {
        url = quote.querySelector("div.article__content h3.article__headline a").href;
      } catch (e) {

      }

      try {
        title = quote.querySelector("div.article__content h3.article__headline a").innerText;
      } catch (e) {

      }

      return { url, title, date };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('div#js-article__body')

  let article = '';

  try {
    article = await page.$eval("div#js-article__body", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_marketwatch_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};