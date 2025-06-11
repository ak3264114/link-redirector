const mongoose = require('mongoose');

const visitLogSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  referer: String,
  slug: String,
  timestamp: { type: Date, default: Date.now },
  location: {
    country: String,
    regionName: String,
    city: String,
    lat: Number,
    lon: Number,
    isp: String,
  },
});

module.exports = mongoose.model('VisitLog', visitLogSchema);
