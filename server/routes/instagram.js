const express = require('express');
const axios = require('axios');
const router = express.Router()
const cacheManager = require('../utils/cacheManager')
const tokenManager = require('../utils/igTokenManager')

const IG_CACHE_PREFIX = 'instagram_'

router.get('/api/instagram/posts', async (req, res) => {
    try {
        // check if response is cached
        const accountAlias = req.query.account;
        const cacheKKey = IG_CACHE_PREFIX + accountAlias;
        if (!accountAlias) {
            res.status(500).json({ error: '`account` query param missing' })
            return;
        }
        const cached = cacheManager.loadCache(cacheKKey)
        if (cached) {
            console.log('returning IG posts from cache')
            res.json(cached);
            return;
        }
        const limit = req.query.limit || 4;
        console.log('[instagram] cache is null or expired - fetching from Instagram API...')
        const accessToken = await tokenManager.getAccessToken(accountAlias)
        const { data } = await axios.get('https://graph.instagram.com/me/media', {
            params: {
                fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
                access_token: accessToken,
                limit: req.query.limit
            }
        })
        const posts = data.data.slice(0, limit)
        // cache the response
        cacheManager.saveCache(cacheKKey, posts)
        res.json(posts)
    } catch (error) {
        console.log('Error fetching instagram posts: ', error.message)
        res.status(500).json({ error: 'Failed to fetch instagram posts' })
    }
})

module.exports = router