const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const VT_BASE = 'https://www.virustotal.com/api/v3';
const API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Upload file to VirusTotal and return analysis/file id
router.post('/scan', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    const resp = await axios.post(`${VT_BASE}/files`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${API_KEY}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // delete temp file
    fs.unlinkSync(req.file.path);

    // resp.data.data.id is usually the SHA256
    return res.json(resp.data);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get file report by hash (md5/sha1/sha256)
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const vtResp = await axios.get(`${VT_BASE}/files/${encodeURIComponent(hash)}`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    res.json(vtResp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
