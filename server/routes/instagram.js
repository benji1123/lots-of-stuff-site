const express = require('express');
const axios = require('axios');
const router = express.Router()
const cacheManager = require('../utils/cacheManager')
const tokenManager = require('../utils/igTokenManager')

const MAX_POSTS_FETCH = 10
const CACHE_NAME_INSTAGAM = 'instagram'

router.get('/api/instagram/posts', async (req, res) => {
    try {
        // check if response is cached
        const cached = cacheManager.loadCache(CACHE_NAME_INSTAGAM)
        if (cached) {
            console.log('returning IG posts from cache')
            res.json(cached);
            return;
        }
        console.log('[instagram] cache is null or expired - fetching from Instagram API...')
        const accessToken = await tokenManager.getAccessToken()
        const { data } = await axios.get('https://graph.instagram.com/me/media', {
            params: {
                fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
                access_token: accessToken,
                limit: MAX_POSTS_FETCH
            }
        })
        // cache the response
        cacheManager.saveCache(CACHE_NAME_INSTAGAM, data.data)
        res.json(data.data)
    } catch (error) {
        console.log('Error fetching instagram posts: ', error.message)
        res.status(500).json({ error: 'Failed to fetch instagram posts' })
    }
})

module.exports = router