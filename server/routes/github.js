const express = require('express');
const axios = require('axios');
const path = require('path')
const router = express.Router();

require('dotenv').config({ path: path.join(__dirname, "..", '.env') });
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'benji1123'
};

router.get("/api/github/repos", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        headers,
        params: {
          per_page: 10,
          sort: "updated",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error.message);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

router.get('/api/github/commits/', async (req, res) => {
  const { data: events } = await axios.get(
    `https://api.github.com/users/${GITHUB_USERNAME}/events`,
    {
      headers,
      params: {
        per_page: 50,
        sort: "updated",
      },
    }
  );

  const commits = [];

  for (const event of events) {
    if (event.type === "PushEvent") {
      const repoName = event.repo.name;
      for (const commit of event.payload.commits) {
        commits.push({
          repo: repoName,
          message: commit.message,
          sha: commit.sha,
          url: `https://github.com/${repoName}/commit/${commit.sha}`,
          author: commit.author?.name || "Unknown",
          timestamp: event.created_at,
        });
      }
    }
  }

  const limit = parseInt(req.query.limit) || 20;
  res.json(commits.slice(0, limit)); // ⏱️ Limit to latest 10
});

module.exports = router;