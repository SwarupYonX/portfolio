/**
 * NETLIFY SERVERLESS FUNCTION - Twitter Posts
 * Runs on-demand when called, no backend server needed
 */

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Twitter API not configured' })
      };
    }

    const username = process.env.TWITTER_USERNAME || 'your_twitter_username';
    
    // Get user ID from username
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

    // Get user's tweets
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
    
    // Transform data
    const posts = tweetsData.data?.map(tweet => ({
      id: tweet.id,
      author: tweetsData.includes?.users?.[0]?.name || 'Unknown',
      authorTitle: `@${tweetsData.includes?.users?.[0]?.username || 'unknown'}`,
      avatar: tweetsData.includes?.users?.[0]?.profile_image_url || '',
      date: formatDate(tweet.created_at),
      content: tweet.text,
      likes: tweet.public_metrics?.like_count || 0,
      comments: tweet.public_metrics?.reply_count || 0,
      shares: tweet.public_metrics?.retweet_count || 0,
      url: `https://twitter.com/${tweetsData.includes?.users?.[0]?.username}/status/${tweet.id}`
    })) || [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify(posts)
    };

  } catch (error) {
    console.error('Twitter API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch Twitter posts',
        details: error.message 
      })
    };
  }
};

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
