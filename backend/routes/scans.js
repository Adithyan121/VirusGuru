const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

const VT_BASE = 'https://www.virustotal.com/api/v3';
const API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Scan a URL
router.post('/urls/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  try {
    const vtResp = await axios.post(
      `${VT_BASE}/urls`,
      qs.stringify({ url }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-apikey": API_KEY,      // ✅ FIXED
        },
      }
    );

    res.json(vtResp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get analysis result by ID
router.get('/analyses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vtResp = await axios.get(
      `${VT_BASE}/analyses/${encodeURIComponent(id)}`,
      {
        headers: { "x-apikey": API_KEY }   // ✅ FIXED
      }
    );

    res.json(vtResp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Domain report
router.get('/domains/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    const vtResp = await axios.get(
      `${VT_BASE}/domains/${encodeURIComponent(domain)}`,
      {
        headers: { "x-apikey": API_KEY }  // ✅ FIXED
      }
    );

    res.json(vtResp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// IP report
router.get('/ip/:ip', async (req, res) => {
  try {
    const { ip } = req.params;

    const vtResp = await axios.get(
      `${VT_BASE}/ip_addresses/${encodeURIComponent(ip)}`,
      {
        headers: { "x-apikey": API_KEY }  // ✅ FIXED
      }
    );

    res.json(vtResp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
