const puppeteer = require("puppeteer");
const { writeFileSync } = require("fs");
const { parse } = require('json2csv');
const Scrape = require('../models/Scrape');

/*const saveAsCSV = (csvData) => {
  const csv = parse(csvData)
  writeFileSync('result.csv', csv);
}*/

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C://chrome-win/chrome.exe',
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  await page.goto("https://www.110totaldentistry.co.uk/fees/", { waitUntil: "load", timeout: 0 });

  let results = [];
  let data = [];
  await page.waitForTimeout(50000);


  results = results.concat(await extractedEvaluateCall(page));

  for (let i = 0; i < results.length; i++) {
    //console.log(results[i].url);
    if (results[i].price && results[i].service) {

      const insertData = {
        title: results[i].service,
        article: results[i].price,
        content: 'dsfsdfsdf',
        url: 'sdfsdfsdfsfsdfsdfsdfsd'
      }
      const item = new Scrape(insertData);
      await item.save();
    }
  }

  // Close the browser
  await browser.close();

 // saveAsCSV(data);
};

async function extractedEvaluateCall(page) {
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll("div.wpb_content_element div.wpb_wrapper table.hover tbody tr");

    return Array.from(quoteList).map((quote) => {
      let service = '', price = '';
      try {
        service = quote.querySelectorAll("strong")[0].innerText;
      } catch (e) {

      }
      try {
        price = quote.querySelectorAll("strong")[1].innerText;
      } catch (e) {

      }

      return { service, price };
    });
  });

  return quotes;
}

module.exports= {
  startScraping: () => {
    getQuotes().then(r => console.log(r));
  },
  price: 'ccc'
};

// Start the scraping
