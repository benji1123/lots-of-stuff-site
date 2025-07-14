const express = require('express');
const path = require('path')
const router = express.Router();
const mm = require('music-metadata');

// https://ben-feed.cc/api/audio-metadata/stellarblade.mp3
router.get('/api/audio-metadata/:filename', async (req, res) => {
    try {
    const filePath = path.join(__dirname, '../public/audio', req.params.filename);
    const metadata = await mm.parseFile(filePath);

    const common = metadata.common;

    res.json({
      title: common.title || 'Unknown Title',
      artist: common.artist || 'Unknown Artist',
      album: common.album || 'Unknown Album',
      duration: metadata.format.duration || null
    });
  } catch (err) {
    console.error('Failed to extract metadata:', err.message);
    res.status(500).json({ error: 'Could not extract metadata' });
  }
});

module.exports = router;