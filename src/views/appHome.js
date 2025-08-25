const { userStore } = require('../store/userStore');

const setupAppHome = async ({ client, event }) => {
  const userId = event.user;
  
  try {
    // Get user info
    const userInfo = await client.users.info({ user: userId });
    const userName = userInfo.user.real_name || userInfo.user.name;
    
    // Get user interests
    const interests = userStore.getUserInterests(userId);
    
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `# Welcome to Conference Connect, ${userName}! 👋\n\nYour personalized conference networking hub is ready to help you connect with fellow attendees and engage with speakers.`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🏷️ Your Current Interests:*'
        }
      }
    ];

    if (interests.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: interests.map(interest => `• ${interest}`).join('\n')
        }
      });
    } else {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '_No interests added yet. Click the button below to get started!_'
        }
      });
    }

    blocks.push(
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '✏️ Update My Interests'
            },
            action_id: 'update_interests',
            style: 'primary'
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🚀 Quick Actions:*'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '• Use `/connect <interest>` to find attendees with similar interests\n• Look for "Ask a Question" buttons in speaker session channels\n• Update your interests regularly to improve connections'
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '💡 *Tip:* The more specific your interests, the better your connections will be!'
          }
        ]
      }
    );

    await client.views.publish({
      user_id: userId,
      view: {
        type: 'home',
        blocks
      }
    });
  } catch (error) {
    console.error('Error setting up App Home:', error);
  }
};

module.exports = { setupAppHome };