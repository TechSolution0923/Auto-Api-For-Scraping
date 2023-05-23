
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

  await page.goto("https://www.scientificamerican.com/section/latest-technology-stories/", { waitUntil: "load", timeout: 0 });

  let results = [];
  let data = [];
  let lastPageNumber = 5;

  for (let index = 0; index < lastPageNumber; index++) {
    results = results.concat(await extractedEvaluateCall(page));
    if (index !== lastPageNumber - 1) {
      await page.click('div.pagination__right a');
      await page.waitForTimeout(5000);
    }
  }

  for (let i = 0; i < results.length; i++) {
    await page.goto(results[i].url, { waitUntil: "load", timeout: 0 });
    const article = await getArticles(page);

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

  // Close the browser
  await browser.close();
};

async function extractedEvaluateCall(page) {
  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.section-latest article.listing-wide");

    return Array.from(quoteList).map((quote) => {
      const url = quote.querySelector("a").href;
      const title = quote.querySelector("a div.listing-wide__inner h2.t_listing-title").innerText;

      return { url, title };
    });
  });

  return quotes;
}

async function getArticles(page) {
  await page.waitForSelector('section.article-grid__main div.article-text')

  let article = '';

  try {
    article = await page.$eval("section.article-grid__main div.article-text", el => el.innerText);
  } catch (e) {

  }

  let date = '';

  try {
    date = await page.$eval("time[itemprop='datePublished']", el => el.innerText);
  } catch (e) {

  }

  return { article, date }
}

module.exports= {
  start_scientific_american_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};