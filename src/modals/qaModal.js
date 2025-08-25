const setupQAModal = async ({ ack, body, view, client }) => {
  await ack();
  
  const userId = body.user.id;
  const question = view.state.values.question_input.question.value;
  
  if (!question || question.trim().length === 0) {
    await ack({
      response_action: 'errors',
      errors: {
        question_input: 'Please enter a question'
      }
    });
    return;
  }

  try {
    // Get user info
    const userInfo = await client.users.info({ user: userId });
    const userName = userInfo.user.real_name || userInfo.user.name;
    
    // Post the question to the speaker-qa channel
    // In a real implementation, you'd have a dedicated channel for this
    // For demo purposes, we'll try to find a #speaker-qa channel or create a message
    
    const channels = await client.conversations.list({
      types: 'public_channel,private_channel'
    });
    
    let qaChannelId = null;
    for (const channel of channels.channels) {
      if (channel.name === 'speaker-qa' || channel.name === 'qa') {
        qaChannelId = channel.id;
        break;
      }
    }
    
    const questionBlocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Question from ${userName}:*`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `> ${question}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Asked by <@${userId}> • ${new Date().toLocaleTimeString()}`
          }
        ]
      }
    ];
    
    if (qaChannelId) {
      // Post to the Q&A channel
      await client.chat.postMessage({
        channel: qaChannelId,
        blocks: questionBlocks
      });
    } else {
      // If no Q&A channel exists, we could create one or post to a general channel
      // For demo, let's just log it
      console.log('Question submitted:', { userName, question, userId });
    }
    
    // Send confirmation to user (this will appear after the modal closes)
    // We'll use a delayed message to the user
    setTimeout(async () => {
      try {
        const dmChannel = await client.conversations.open({
          users: userId
        });
        
        await client.chat.postMessage({
          channel: dmChannel.channel.id,
          text: `✅ Your question has been submitted successfully! The speaker will review it for the Q&A session.\n\n*Your question:* "${question}"`
        });
      } catch (error) {
        console.error('Error sending confirmation:', error);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Error handling question submission:', error);
    
    await ack({
      response_action: 'errors',
      errors: {
        question_input: 'Sorry, there was an error submitting your question. Please try again.'
      }
    });
  }
};

module.exports = { setupQAModal };