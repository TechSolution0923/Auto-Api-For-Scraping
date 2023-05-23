
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

  await page.goto("https://www.wired.com/most-recent/", { waitUntil: "load", timeout: 0 });

  let results = [];
  let data = [];
  let lastPageNumber = 5;

  await page.waitForTimeout(50000)
  for (let index = 0; index < lastPageNumber; index++) {
    results = results.concat(await extractedEvaluateCall(page));
    if (index !== lastPageNumber - 1) {
      await page.click('a[data-section-title="Next Page"]');
      await page.waitForTimeout(5000);
    }
  }

  for (let i = 0; i < results.length; i++) {
    console.log(results[i].url);
    if (results[i].url != '' && results[i].title != '') {

      const nextUrl = results[i].url;
      let article = '';

      await page.goto(results[i].url, { waitUntil: "load", timeout: 0 });

      if (nextUrl.search('gallery') == -1 && nextUrl.search('live') == -1) {
        article = await getArticles(page);
      } else if (nextUrl.search('gallery') > -1) {
        article = await getArticlesGallery(page);
      }

      if (article.article != '' && article.date != '') {
        const insertData = {
          date: article.date,
          title: results[i].title,
          article: article.article,
          url: results[i].url
        }
        const item = new Scrape(insertData);
        await item.save();
        data.push(insertData);
      }
    }
  }

  // Close the browser
  await browser.close();
};

async function extractedEvaluateCall(page) {
  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.grid-layout__content div.summary-list__items div.summary-list__item");

    return Array.from(quoteList).map((quote) => {
      let url = '', title = '';
      try {
        url = quote.querySelector("div.summary-item__content a.summary-item__hed-link").href;
      } catch (e) {

      }

      try {
        title = quote.querySelector("div.summary-item__content a.summary-item__hed-link h3").innerText;
      } catch (e) {

      }

      return { url, title };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('div.body__inner-container')

  let article = '';
  try {
    article = await page.$eval("div.body__inner-container", el => el.innerText);
  } catch (e) {

  }

  let date = '';
  try {
    date = await page.$eval("time.ContentHeaderTitleBlockPublishDate-hYmSqb", el => el.innerText);
  } catch (e) {

  }

  return { article, date }
}

async function getArticlesGallery(page) {
  await page.waitForSelector('div.GalleryPageTextBlock-lkymFq')

  let article = '';
  try {
    article = await page.$eval("div.GalleryPageTextBlock-lkymFq", el => el.innerText);
  } catch (e) {

  }

  let date = '';
  try {
    date = await page.$eval("time.ContentHeaderTitleBlockPublishDate-hYmSqb", el => el.innerText);
  } catch (e) {

  }

  return { article, date }
}

module.exports= {
  start_wired_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};