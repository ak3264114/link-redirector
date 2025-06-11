const express = require('express');
const axios = require('axios');
const VisitLog = require('../models/VisitLog');

const router = express.Router();

// Example hardcoded slug-to-URL map
const redirectMap = {
  default: 'https://example.com',
  yt: 'https://youtube.com',
  gh: 'https://github.com',
};

router.get('/:slug', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'] || 'Direct';
  const slug = req.params.slug || 'default';

  let location = {};
  try {
    const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
    location = geoRes.data;
  } catch (err) {
    console.error('Failed to fetch geolocation', err.message);
  }

  const log = new VisitLog({
    ip,
    userAgent,
    referer,
    slug,
    location,
  });

  await log.save();
  console.log(`Logged IP: ${ip} → ${slug}`);

  const targetURL = redirectMap[slug] || redirectMap.default;
  res.redirect(targetURL);
});




router.get('/admin/logs', async (req, res) => {
  const logs = await VisitLog.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});


module.exports = router;
