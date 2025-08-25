const { userStore } = require('../store/userStore');

const connectCommand = async ({ command, ack, respond, client }) => {
  await ack();

  const interest = command.text.trim();
  
  if (!interest) {
    await respond({
      text: '❓ Please specify an interest to search for. Example: `/connect Bolt.new`',
      response_type: 'ephemeral'
    });
    return;
  }

  // Find users with matching interests
  const matchingUsers = userStore.findUsersByInterest(interest);
  
  if (matchingUsers.length === 0) {
    await respond({
      text: `🔍 No attendees found with interest in "${interest}". Try a different keyword or encourage others to update their interests!`,
      response_type: 'ephemeral'
    });
    return;
  }

  // Create blocks for each matching user
  const userBlocks = [];
  
  for (const user of matchingUsers.slice(0, 10)) { // Limit to 10 users
    try {
      // Get user info from Slack
      const userInfo = await client.users.info({ user: user.userId });
      const userName = userInfo.user.real_name || userInfo.user.name;
      const userHandle = userInfo.user.name;
      
      userBlocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `👤 *${userName}* (@${userHandle})\n🏷️ Interests: ${user.interests.join(', ')}`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '💬 Send DM'
          },
          action_id: `dm_user_${user.userId}`,
          style: 'primary'
        }
      });
      
      // Add divider between users (except for the last one)
      if (user !== matchingUsers[matchingUsers.length - 1] && userBlocks.length < matchingUsers.length * 2) {
        userBlocks.push({
          type: 'divider'
        });
      }
    } catch (error) {
      console.error(`Error fetching user info for ${user.userId}:`, error);
      // Skip this user if we can't get their info
    }
  }

  if (userBlocks.length === 0) {
    await respond({
      text: `🔍 Found ${matchingUsers.length} attendees interested in "${interest}", but couldn't load their details. Please try again.`,
      response_type: 'ephemeral'
    });
    return;
  }

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🎯 *Found ${matchingUsers.length} attendee${matchingUsers.length === 1 ? '' : 's'} interested in "${interest}"*`
      }
    },
    {
      type: 'divider'
    },
    ...userBlocks
  ];

  if (matchingUsers.length > 10) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `_Showing first 10 of ${matchingUsers.length} results. Try a more specific search term to narrow down results._`
        }
      ]
    });
  }

  await respond({
    blocks,
    response_type: 'ephemeral'
  });
};

module.exports = { connectCommand };