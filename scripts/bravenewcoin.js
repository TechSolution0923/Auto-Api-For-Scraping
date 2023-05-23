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
  await page.goto("https://bravenewcoin.com/events");

  await page.waitForTimeout(50000);
  let results = [];
  let data = [];
  let lastPageNumber = 10;

  for (let j = 0; j < lastPageNumber; j++) {
    if (j !== lastPageNumber - 1) {
      await page.mouse.wheel({deltaY: 3000});
      await page.waitForTimeout(1000);
    }
  }

  const length = await page.$$eval('app-event-list div.event-item-group', els => els.length);

  for (let i = 1; i < length; i++) {
    const day = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.row div.event-date div span:nth-child(1)', el => el.innerText);
    const month = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.row div.event-date div span:nth-child(2)', el => el.innerText);
    const week = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.row div.event-date div span:nth-child(3)', el => el.innerText);
    const eventName = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.event-name a', el => el.innerText);
    const url = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.event-name a', el => el.href);
    const eventType = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.event-type', el => el.innerText);
    const location = await page.$eval('app-event-list div.event-item-group:nth-child('+(i+1)+') div.event-item:nth-child(1) div.event-location', el => el.innerText);

    const insertData = {
      day,
      month,
      week,
      eventName,
      url,
      eventType,
      location
    }
    results.push(insertData)
  }

  for (let i = 0; i < results.length; i++) {
    await page.goto(results[i].url);
    await page.waitForTimeout(1000);

    const article = await getArticles(page);

    const insertData = {
      day: results[i].day,
      month: results[i].month,
      week: results[i].week,
      eventName: results[i].eventName,
      eventType: results[i].eventType,
      location: results[i].location,
      article: article.article,
      url: results[i].url
    }
    data.push(insertData)
    const item = new Scrape(insertData);
    await item.save();
  }

  // Close the browser
  await browser.close();
};

async function getArticles(page) {
  await page.waitForSelector('div.event')

  let article = '';

  try {
    article = await page.$eval("div.event div.row div.col-9", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_bravenewcoin_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};


