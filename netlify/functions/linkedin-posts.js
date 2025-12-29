/**
 * NETLIFY SERVERLESS FUNCTION - LinkedIn Posts
 * Runs on-demand when called, no backend server needed
 */

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    
    if (!accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'LinkedIn API not configured' })
      };
    }

    // LinkedIn API call (simplified)
    const response = await fetch(
      'https://api.linkedin.com/v2/ugcPosts?' +
      new URLSearchParams({
        'q': 'authors',
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
    
    const posts = data.elements?.map(post => ({
      id: post.id,
      author: 'Swarup Das',
      authorTitle: 'Cloud & AI Engineer',
      avatar: '',
      date: formatDate(post.created?.time),
      content: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
      likes: post.statistics?.numLikes || 0,
      comments: post.statistics?.numComments || 0,
      shares: post.statistics?.numShares || 0,
      url: `https://www.linkedin.com/feed/update/${post.id}`
    })) || [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify(posts)
    };

  } catch (error) {
    console.error('LinkedIn API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch LinkedIn posts',
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
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}
