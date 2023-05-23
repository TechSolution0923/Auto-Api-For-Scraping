const express = require('express');
const router = express.Router();
const { start_engadget_scraping } = require('../../scripts/engadget');
const { start_bloomberg_scraping } = require('../../scripts/bloomberg');
const { start_bravenewcoin_scraping } = require('../../scripts/bravenewcoin');
const { start_cnet_scraping } = require('../../scripts/cnet');
const { start_coindesk_scraping } = require('../../scripts/coindesk');
const { start_cointelegraph_adoption_scraping } = require('../../scripts/cointelegraph_adoption');
const { start_cointelegraph_altcoin_scraping } = require('../../scripts/cointelegraph_altcoin');
const { start_cointelegraph_bitcoin_scraping } = require('../../scripts/cointelegraph_bitcoin');
const { start_cointelegraph_blockchain_scraping } = require('../../scripts/cointelegraph_blockchain');
const { start_cointelegraph_defi_scraping } = require('../../scripts/cointelegraph_defi');
const { start_cointelegraph_ethereum_scraping } = require('../../scripts/cointelegraph_ethereum');
const { start_cointelegraph_nft_scraping } = require('../../scripts/cointelegraph_nft');
const { start_cointelegraph_policy_scraping } = require('../../scripts/cointelegraph_policy');
const { start_cointelegraph_business_scraping } = require('../../scripts/cointelegraph_business');
const { start_cryptoslate_scraping } = require('../../scripts/cryptoslate');
const { start_decrypt_scraping } = require('../../scripts/decrypt');
const { start_gizmodo_scraping } = require('../../scripts/gizmodo');

const { start_livelicense_scraping } = require('../../scripts/livescience');
const { start_marketwatch_scraping } = require('../../scripts/marketwatch');
const { start_merchant_scraping } = require('../../scripts/merchant');
const { start_scientific_american_scraping } = require('../../scripts/scientific_american');
const { start_defiant_scraping } = require('../../scripts/defiant');

const { start_techcrunch_scraping } = require('../../scripts/techcrunch');
const { start_theblock_scraping } = require('../../scripts/theblock');
const { start_wired_scraping } = require('../../scripts/wired');
const { start_blockonomi_scraping } = require('../../scripts/blockonomi');
const { start_ars_scraping } = require('../../scripts/ars');

router.post('/scrape_engadget', async (req, res) => {
  start_engadget_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_bloomberg', async (req, res) => {
  start_bloomberg_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_marketwatch', async (req, res) => {
  start_marketwatch_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_scientific_american', async (req, res) => {
  start_scientific_american_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_gizmodo', async (req, res) => {
  start_gizmodo_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_wired', async (req, res) => {
  start_wired_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_livescience', async (req, res) => {
  start_livelicense_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_coindesk', async (req, res) => {
  start_coindesk_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_theblock', async (req, res) => {
  start_theblock_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_techcrunch', async (req, res) => {
  start_techcrunch_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_defiant', async (req, res) => {
  start_defiant_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_decrypt', async (req, res) => {
  start_decrypt_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cryptoslate', async (req, res) => {
  start_cryptoslate_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cointelegraph_policy', async (req, res) => {
  start_cointelegraph_policy_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cointelegraph_nft', async (req, res) => {
  start_cointelegraph_nft_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_cointelegraph_ethereum', async (req, res) => {
  start_cointelegraph_ethereum_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cointelegraph_defi', async (req, res) => {
  start_cointelegraph_defi_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_business', async (req, res) => {
  start_cointelegraph_business_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cointelegraph_blockchain', async (req, res) => {
  start_cointelegraph_blockchain_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cointelegraph_bitcoin', async (req, res) => {
  start_cointelegraph_bitcoin_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_cointelegraph_altcoin', async (req, res) => {
  start_cointelegraph_altcoin_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_cointelegraph_adoption', async (req, res) => {
  start_cointelegraph_adoption_scraping();
  res.status(200).json({msg: 'Success!'})
});


router.post('/scrape_cnet', async (req, res) => {
  start_cnet_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_bravenewcoin', async (req, res) => {
  start_bravenewcoin_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_blockonomi', async (req, res) => {
  start_blockonomi_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_ars', async (req, res) => {
  start_ars_scraping();
  res.status(200).json({msg: 'Success!'})
});

router.post('/scrape_merchant', async (req, res) => {
  start_merchant_scraping();
  res.status(200).json({msg: 'Success!'})
});
module.exports = router;