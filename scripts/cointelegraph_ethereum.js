
import puppeteer from "puppeteer";
import Scrape from '../models/Scrape';

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C://chrome-win/chrome.exe',
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0)
  await page.goto("https://cointelegraph.com/tags/defi");

  await page.waitForTimeout(10000);
  let results = [];
  let data = [];
  let lastPageNumber = 10;

  for (let j = 0; j < lastPageNumber; j++) {
    if (j !== lastPageNumber - 1) {
      await page.mouse.wheel({deltaY: 1000});
      await page.waitForTimeout(1000);
    }
  }

  const length = await page.$$eval('div.posts-listing ul.posts-listing__list li.posts-listing__item', els => els.length);

  for (let i = 0; i < length; i++) {
    if (i != 12) {
      const url = await page.$eval('div.posts-listing ul.posts-listing__list li.posts-listing__item:nth-child('+(i+1)+') div.post-card-inline__content div.post-card-inline__header a', el => el.href);
      const title = await page.$eval('div.posts-listing ul.posts-listing__list li.posts-listing__item:nth-child('+(i+1)+') div.post-card-inline__content div.post-card-inline__header a span', el => el.innerText);
      const content = await page.$eval('div.posts-listing ul.posts-listing__list li.posts-listing__item:nth-child('+(i+1)+') div.post-card-inline__content p.post-card-inline__text', el => el.innerText);

      const insertData = {
        title,
        content,
        url
      }
      results.push(insertData)
    }
  }

  for (let i = 0; i < results.length; i++) {
    await page.goto(results[i].url);
    await page.waitForTimeout(1000);

    const gotoUrl = results[i].url;
    let article = ''

    if (gotoUrl.search('explained') == -1) {
      article = await getArticles(page);
    } else {
      article = await getExplained(page);
    }

    const insertData = {
      title: results[i].title,
      content: results[i].content,
      article: article.article,
      url: results[i].url
    }
    const item = new Scrape(insertData);
    await item.save();
    data.push(insertData);
  }

  // Close the browser
  await browser.close();
};

async function getArticles(page) {
  await page.waitForSelector('div.container')

  let article = '';

  try {
    article = await page.$eval("div.post-page__content-col", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

async function getExplained(page) {
  await page.waitForSelector('div#explained-post-page')

  let article = '';

  try {
    article = await page.$eval("div.explained-post-content__list", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_cointelegraph_ethereum_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};