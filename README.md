# 🚀 Conference Connect - Slack App

A Slack app designed to enhance the conference experience by facilitating networking and Q&A interactions.

## ✨ Features

### 1. `/connect` Command 🤝
Find other attendees based on shared interests:
```
/connect Bolt.new
/connect JavaScript
/connect AI
```

### 2. Speaker Q&A Modal 🗣️
- Attendees can submit questions for speakers
- Questions are reviewed privately before being asked
- Seamless integration with conference sessions

### 3. Personalized App Home 🏠
- Welcome dashboard with user's interests
- Easy interest management
- Quick action guides

## 🛠️ Setup

### Prerequisites
- Node.js 16+ installed
- A Slack workspace where you can install apps
- Slack app credentials (Bot Token, Signing Secret, App Token)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Slack app credentials:
```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here
PORT=3000
```

3. **Start the application:**
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## 🔧 Slack App Configuration

### Required Scopes (OAuth & Permissions)
- `app_mentions:read`
- `channels:read`
- `chat:write`
- `commands`
- `im:write`
- `users:read`

### Event Subscriptions
- `app_home_opened`

### Slash Commands
- `/connect` - Find attendees by interest

### Interactive Components
Enable interactivity for buttons and modals.

### Socket Mode
Enable Socket Mode and generate an App-Level Token.

## 📱 Usage

### For Attendees
1. **Update your interests:** Visit the App Home tab and click "Update My Interests"
2. **Find connections:** Use `/connect <interest>` to find people with similar interests
3. **Ask questions:** Click "Ask a Question" buttons in speaker session channels

### For Organizers
Use the Q&A helper to post question buttons in speaker channels:
```javascript
const { postQAButton } = require('./src/utils/qaHelper');
await postQAButton(client, channelId, 'Speaker Name');
```

## 🏗️ Architecture

```
src/
├── app.js              # Main application entry point
├── commands/
│   └── connect.js      # /connect slash command handler
├── views/
│   └── appHome.js      # App Home tab interface
├── modals/
│   └── qaModal.js      # Q&A question submission modal
├── store/
│   └── userStore.js    # In-memory user data store
└── utils/
    └── qaHelper.js     # Q&A session utilities
```

## 🎯 Demo Flow

1. **Setup Phase:** Install app, configure interests
2. **Networking:** Use `/connect` to find attendees
3. **Q&A Session:** Submit questions for speakers
4. **App Home:** Manage interests and view dashboard

## 🔮 Future Enhancements

- Persistent database storage
- Advanced matching algorithms
- Integration with conference platforms
- Analytics dashboard for organizers
- Real-time notifications

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using [Bolt for JavaScript](https://slack.dev/bolt-js/)