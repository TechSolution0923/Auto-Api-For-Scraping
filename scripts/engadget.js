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

  await page.goto("https://www.engadget.com/news/", { waitUntil: "load", timeout: 0 });

  let results = [];
  let data = [];
  let lastPageNumber = 5;

  await page.waitForTimeout(50000);
  for (let index = 0; index < lastPageNumber; index++) {
    await page.click('li.loadmore-parent button');
    await page.waitForTimeout(5000);
  }

  results = results.concat(await extractedEvaluateCall(page));

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
    if (results[i].url && results[i].title && results[i].content) {
      await page.goto(results[i].url, { waitUntil: "load", timeout: 0 });
      const article = await getArticles(page);

      const insertData = {
        date: article.date,
        title: results[i].title,
        content: results[i].content,
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
    const quoteList = document.querySelectorAll("article[data-component='PostCard']");

    return Array.from(quoteList).map((quote) => {
      let url = '', title = '', content = '';
      try {
        url = quote.querySelector("a").href;
      } catch (e) {

      }

      try {
        title = quote.querySelector("h2 a").innerText;
      } catch (e) {

      }

      try {
        content = quote.querySelector("div.serif").innerText;
      } catch (e) {

      }

      return { url, title, content };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('div#module-article-container div.article-text')

  let article = '';

  try {
    article = await page.$eval("div#module-article-container div.article-text", el => el.innerText);
  } catch (e) {

  }

  let date = '';

  try {
    date = await page.$eval("div[data-component='HorizontalAuthorInfo'] span:last-child", el => el.innerText);
  } catch (e) {

  }

  return { article, date }
}

module.exports= {
  start_engadget_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};

