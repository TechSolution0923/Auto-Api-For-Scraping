
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
  await page.goto("https://www.livescience.com/news");

  await page.waitForTimeout(50000);

  let results = [];
  let data = [];
  let lastPageNumber = 10;

  for (let index = 1; index < lastPageNumber; index++) {
    await page.waitForTimeout(5000);
    results = results.concat(await extractedEvaluateCall(page));
    if (index !== lastPageNumber - 1) {
      await page.click('div.pagination ul li:nth-child('+(index+1)+') a');
      await page.waitForTimeout(5000);
    }
  }

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
    if (results[i].url != '') {
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
      data.push(insertData);
    }
  }

  // Close the browser
  await browser.close();
};

async function extractedEvaluateCall(page) {
  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.listingResults div.listingResult");

    return Array.from(quoteList).map((quote) => {
      let url = '', title = '', content = '', date = '';

      try {
        url = quote.querySelector("a.article-link").href;
      } catch (error) {

      }

      try {
        title = quote.querySelector("a.article-link article div.content header h3.article-name").innerText;
      } catch (error) {

      }

      try {
        content = quote.querySelector("a.article-link article div.content p.synopsis").innerText;
      } catch (error) {

      }

      try {
        date = quote.querySelector("a.article-link article div.content p.byline time").innerText;
      } catch (error) {

      }

      return { url, title, content, date };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('article div#content')

  let article = '';

  try {
    article = await page.$eval("article div#content", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_livelicense_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};