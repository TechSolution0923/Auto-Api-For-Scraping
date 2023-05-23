
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

  await page.setDefaultNavigationTimeout(0)
  await page.goto("https://merchants.egyptianlinens.com/collections/sheet-sets");

  let results = [];
  let urls = [];

  await page.waitForTimeout(5000)
  urls = await extractedEvaluateCall(page);

  for (const url of urls) {
    await page.goto(url.url);
    await page.waitForTimeout(2000)
    results = results.concat(await getAllInformation(page));
  }
  console.log(results);

  // Close the browser
  await browser.close();

  // Save data into .csv fi
};

async function extractedEvaluateCall(page) {
  await page.waitForTimeout(2000);
  return await page.evaluate(() => {
    const items = document.querySelectorAll("div.product-list div.product-item");

    return Array.from(items).map((item) => {
      const url = item.querySelector("a.product-item__image-wrapper").href;
      return {url};
    });
  });
}

async function getSize(page) {
  return await page.evaluate(() => {
    const items = document.querySelectorAll("div.product-block-list__item--info div.card div.card__section form.product-form div.product-form__variants div.product-form__option div.block-swatch-list div.block-swatch");

    return Array.from(items).map((item) => {
      const attr = item.querySelector("label.block-swatch__item span.block-swatch__item-text").innerText;
      return {attr};
    });
  })
}

async function getColor(page) {
  return await page.evaluate(() => {
    const items = document.querySelectorAll("div.product-block-list__item--info div.card div.card__section form.product-form div.product-form__variants div.product-form__option div.block-swatch-list div.block-swatch");

    return Array.from(items).map((item) => {
      const attr = item.querySelector("label.block-swatch__item span.block-swatch__item-text").innerText;
      return {attr};
    });
  })
}

async function getAllInformation(page) {
  await page.waitForSelector('div.product-block-list__wrapper')

  let imageUrl = await page.$eval("div.product-block-list__item--gallery div.card div.card__section--tight div.product-gallery div.product-gallery__carousel-wrapper div.product-gallery__carousel div.flickity-viewport div.flickity-slider div.product-gallery__carousel-item div.product-gallery__size-limiter div.aspect-ratio img.product-gallery__image", el => el.getAttribute('srcset'))

  let name = await page.$eval("div.product-block-list__item--info div.card div.card__section div.product-meta h1.product-meta__title", el => el.innerText)
  let sku = await page.$eval("div.product-block-list__item--info div.card div.card__section div.product-meta div.product-meta__reference span.product-meta__sku span.product-meta__sku-number", el => el.innerText)

  let size = []
  let sizeStr = ''
  size = size.concat(await getSize(page))
  for (let i = 0; i < size.length; i++) {
    sizeStr += size[i].attr + ","
  }

  let color = []
  let colorStr = ''
  color = color.concat(await getColor(page))
  for (let i = 0; i < color.length; i++) {
    colorStr += color[i].attr + ","
  }

  let price = await page.$eval("div.product-block-list__item--info div.card div.card__section form.product-form div.product-form__info-list div.product-form__info-item div.product-form__info-content div.price-list span.price", el => el.innerText)
  let qty = 'yes'


  return { imageUrl, name, sku, sizeStr, colorStr, price, qty }
}

module.exports= {
  start_merchant_scraping: () => {
    getQuotes().then(r => console.log(r));
  }
};