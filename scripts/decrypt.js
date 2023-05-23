
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
  await page.goto("https://decrypt.co/news");

  await page.waitForTimeout(50000);
  let results = [];
  let data = [];
  let lastPageNumber = 10;

  for (let j = 0; j < lastPageNumber; j++) {
    if (j !== lastPageNumber - 1) {
      await page.click('article div.justify-end button');
      await page.waitForTimeout(5000);
    }
  }

  for (let i = 0; i < lastPageNumber; i++) {
    await page.waitForTimeout(5000);
    results = results.concat(await extractedEvaluateCall(page, i+1));
  }

  for (let i = 0; i < results.length; i++) {
    await page.goto(results[i].url);
    await page.waitForTimeout(5000);
    const article = await getArticles(page);

    const insertData = {
      bigTitle: results[i].bigTitle,
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

async function extractedEvaluateCall(page, index) {

  const quotos = await page.$$eval('div.flex article.max-w-3xl article:nth-child('+index+') div:nth-child(2) div.pb-5', quotos => {
    return quotos.map(quoto => {
      const bigTitle = quoto.querySelector("article div.grow p").innerText;
      const url = quoto.querySelector("article div.grow h3 a.linkbox__overlay").href;
      const title = quoto.querySelector("article div.grow h3 a.linkbox__overlay span").innerText;
      const content = quoto.querySelector("article div.grow p").innerText;

      return { bigTitle, title, content, url };
    })
  })

  return quotos
}

async function getArticles(page) {
  await page.waitForSelector('main')

  let article = '';

  try {
    article += await page.$eval("div.grow div.relative div.post-content", el => el.innerText);
  } catch (e) {

  }

  return { article }
}

module.exports= {
  start_decrypt_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};