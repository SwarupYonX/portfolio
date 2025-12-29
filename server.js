/**
 * BACKEND API PROXY SERVER
 * Securely handles social media API calls
 * Keeps API keys safe on the server side
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ===== TWITTER API ENDPOINT =====
app.get('/api/twitter/posts', async (req, res) => {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      return res.status(500).json({ 
        error: 'Twitter API credentials not configured' 
      });
    }

    // Get your Twitter user ID first, or use username lookup
    const username = 'your_twitter_username'; // Replace with your username
    
    // Step 1: Get user ID from username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!userResponse.ok) {
      throw new Error(`Twitter API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Step 2: Get user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?` +
      new URLSearchParams({
        'max_results': '10',
        'tweet.fields': 'created_at,public_metrics,text',
        'expansions': 'author_id',
        'user.fields': 'name,username,profile_image_url'
      }),
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!tweetsResponse.ok) {
      throw new Error(`Twitter API error: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    
    // Transform Twitter data to our format
    const posts = tweetsData.data?.map(tweet => ({
      id: tweet.id,
      author: tweetsData.includes?.users?.[0]?.name || 'Unknown',
      authorTitle: `@${tweetsData.includes?.users?.[0]?.username || 'unknown'}`,
      avatar: tweetsData.includes?.users?.[0]?.profile_image_url || 'https://via.placeholder.com/48',
      date: formatDate(tweet.created_at),
      content: tweet.text,
      likes: tweet.public_metrics?.like_count || 0,
      comments: tweet.public_metrics?.reply_count || 0,
      shares: tweet.public_metrics?.retweet_count || 0,
      url: `https://twitter.com/${tweetsData.includes?.users?.[0]?.username}/status/${tweet.id}`
    })) || [];

    res.json(posts);

  } catch (error) {
    console.error('Twitter API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Twitter posts',
      details: error.message 
    });
  }
});

// ===== LINKEDIN API ENDPOINT =====
app.get('/api/linkedin/posts', async (req, res) => {
  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ 
        error: 'LinkedIn API credentials not configured' 
      });
    }

    // LinkedIn API v2 - Get user posts
    const response = await fetch(
      'https://api.linkedin.com/v2/ugcPosts?' +
      new URLSearchParams({
        'q': 'authors',
        'authors': 'List({your_person_urn})', // Replace with your person URN
        'count': '10'
      }),
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform LinkedIn data to our format
    const posts = data.elements?.map(post => ({
      id: post.id,
      author: 'Swarup Das', // Get from profile API
      authorTitle: 'Cloud & AI Engineer',
      avatar: 'https://via.placeholder.com/48', // Get from profile API
      date: formatDate(post.created?.time),
      content: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
      likes: post.statistics?.numLikes || 0,
      comments: post.statistics?.numComments || 0,
      shares: post.statistics?.numShares || 0,
      url: `https://www.linkedin.com/feed/update/${post.id}`
    })) || [];

    res.json(posts);

  } catch (error) {
    console.error('LinkedIn API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch LinkedIn posts',
      details: error.message 
    });
  }
});

// Helper function to format dates
function formatDate(timestamp) {
  if (!timestamp) return 'Recently';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API proxy server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at:`);
  console.log(`   - http://localhost:${PORT}/api/twitter/posts`);
  console.log(`   - http://localhost:${PORT}/api/linkedin/posts`);
  console.log(`   - http://localhost:${PORT}/api/health`);
});
