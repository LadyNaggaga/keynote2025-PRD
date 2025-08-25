// Helper function to post Q&A button in speaker sessions
const postQAButton = async (client, channelId, speakerName = 'the speaker') => {
  try {
    await client.chat.postMessage({
      channel: channelId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎤 *Q&A Session with ${speakerName}*\n\nHave a question for ${speakerName}? Submit it below and it will be reviewed for the Q&A session!`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '❓ Ask a Question'
              },
              action_id: 'ask_question',
              style: 'primary'
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '💡 Questions are submitted anonymously to the speaker for review'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error posting Q&A button:', error);
  }
};

module.exports = { postQAButton };