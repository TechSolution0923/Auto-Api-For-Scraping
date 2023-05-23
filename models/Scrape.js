const mongoose = require('mongoose');

const ScrapeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: undefined
  },
  article: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  day: {
    type: String,
    default: undefined
  },
  month: {
    type: String,
    default: undefined
  },
  week: {
    type: String,
    default: undefined
  },
  eventName: {
    type: String,
    default: undefined
  },
  eventType: {
    type: String,
    default: undefined
  },
  location: {
    type: String,
    default: undefined
  },
  date: {
    type: Date,
    default: undefined
  }
});

module.exports = mongoose.model('scrape', ScrapeSchema);
