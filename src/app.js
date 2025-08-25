const { App } = require('@slack/bolt');
const { userStore } = require('./store/userStore');
const { connectCommand } = require('./commands/connect');
const { setupAppHome } = require('./views/appHome');
const { setupQAModal } = require('./modals/qaModal');

require('dotenv').config();

// Initialize the Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

// Register the /connect slash command
app.command('/connect', connectCommand);

// Handle App Home opened event
app.event('app_home_opened', setupAppHome);

// Handle update interests button
app.action('update_interests', async ({ ack, body, client }) => {
  await ack();
  
  const userId = body.user.id;
  const currentInterests = userStore.getUserInterests(userId);
  
  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'update_interests_modal',
      title: {
        type: 'plain_text',
        text: 'Update Your Interests'
      },
      submit: {
        type: 'plain_text',
        text: 'Save'
      },
      close: {
        type: 'plain_text',
        text: 'Cancel'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Add your interests to help other attendees find you! Separate multiple interests with commas.'
          }
        },
        {
          type: 'input',
          block_id: 'interests_input',
          element: {
            type: 'plain_text_input',
            action_id: 'interests',
            multiline: true,
            initial_value: currentInterests.join(', '),
            placeholder: {
              type: 'plain_text',
              text: 'e.g., Bolt.new, JavaScript, AI, Web Development'
            }
          },
          label: {
            type: 'plain_text',
            text: 'Your Interests'
          }
        }
      ]
    }
  });
});

// Handle interests update submission
app.view('update_interests_modal', async ({ ack, body, view, client }) => {
  await ack();
  
  const userId = body.user.id;
  const interestsValue = view.state.values.interests_input.interests.value;
  const interests = interestsValue
    .split(',')
    .map(interest => interest.trim())
    .filter(interest => interest.length > 0);
  
  userStore.updateUserInterests(userId, interests);
  
  // Refresh the App Home
  await setupAppHome({ client, event: { user: userId } });
});

// Handle Ask Question button
app.action('ask_question', async ({ ack, body, client }) => {
  await ack();
  
  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'ask_question_modal',
      title: {
        type: 'plain_text',
        text: 'Ask a Question'
      },
      submit: {
        type: 'plain_text',
        text: 'Submit Question'
      },
      close: {
        type: 'plain_text',
        text: 'Cancel'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Submit your question for the speaker. Your question will be reviewed and may be asked during the Q&A session.'
          }
        },
        {
          type: 'input',
          block_id: 'question_input',
          element: {
            type: 'plain_text_input',
            action_id: 'question',
            multiline: true,
            placeholder: {
              type: 'plain_text',
              text: 'What would you like to ask the speaker?'
            }
          },
          label: {
            type: 'plain_text',
            text: 'Your Question'
          }
        }
      ]
    }
  });
});

// Handle question submission
app.view('ask_question_modal', setupQAModal);

// Handle DM button clicks
app.action(/^dm_user_(.+)$/, async ({ ack, body, client, action }) => {
  await ack();
  
  const targetUserId = action.action_id.replace('dm_user_', '');
  const currentUserId = body.user.id;
  
  try {
    // Open a DM conversation with the target user
    const conversation = await client.conversations.open({
      users: `${currentUserId},${targetUserId}`
    });
    
    // Send a message to help start the conversation
    await client.chat.postMessage({
      channel: conversation.channel.id,
      text: `Hi! I found you through Conference Connect. I'd love to connect and chat about our shared interests! 👋`
    });
    
    // Send a confirmation to the user
    await client.chat.postEphemeral({
      channel: body.channel.id,
      user: currentUserId,
      text: `✅ I've started a DM conversation with <@${targetUserId}> for you!`
    });
  } catch (error) {
    console.error('Error opening DM:', error);
    await client.chat.postEphemeral({
      channel: body.channel.id,
      user: currentUserId,
      text: `❌ Sorry, I couldn't start a DM with that user. They might have DMs disabled.`
    });
  }
});

// Start the app
(async () => {
  try {
    await app.start();
    console.log('⚡️ Conference Connect app is running!');
    console.log('🚀 Ready to enhance your conference experience!');
  } catch (error) {
    console.error('Failed to start app:', error);
  }
})();