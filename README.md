I love that idea! A good PRD is the foundation of any project, and having it in a clean, readable format like Markdown with emojis will make it perfect for a demo.

Here is the full PRD for "Conference Connect," ready to be put into a Markdown file.

---

# 🚀 Product Requirements Document: Conference Connect

**Owner:** Maria Naggaga
**Version:** 1.0
**Date:** August 24, 2025

## 🎯 1. Introduction & Vision

**Conference Connect** is a Slack app designed to enhance the experience for attendees and speakers at conferences. Our vision is to create a digital hub within the conference's Slack workspace, making networking, Q&A, and information discovery seamless and intuitive. By centralizing key interactions, we aim to transform the way people engage with each other and with the content.

## 🤔 2. Problem Statement

Attending a conference can be overwhelming. Information is often scattered across websites, social media, and event apps. For attendees, it's difficult to:
- Find and connect with others who share similar interests.
- Get quick answers to questions for speakers after their talk.
- Discover relevant sessions or people without a lot of friction.

For speakers, it's hard to:
- Field questions from a large audience efficiently.
- Connect with interested attendees after their talk.

Conference Connect will solve these problems by providing a unified, user-friendly platform directly within a tool people are already using: Slack.

## ✨ 3. Goals & Objectives

- **Primary Goal:** Increase attendee engagement and networking during the conference.
- **Objective 1:** Enable attendees to discover and connect with at least 5 new people by the end of the conference.
- **Objective 2:** Facilitate a structured Q&A process for at least 80% of speaker sessions.
- **Objective 3:** Provide a single, personalized dashboard (App Home) for users to manage their conference experience.

## 👥 4. Target Users

- **Primary User:** The conference attendee.
  - *Persona:* A developer looking to network, learn about new technologies, and find potential collaborators.
- **Secondary User:** The conference speaker.
  - *Persona:* An expert presenting a topic, who needs an easy way to interact with the audience and answer questions.
- **Tertiary User:** The conference organizer/moderator.
  - *Persona:* Someone who needs a tool to manage the flow of sessions and Q&A.

## 📝 5. Functional Requirements (MVP)

### 1. The `/connect` Slash Command 🤝

- **Description:** A command that allows users to find other attendees based on shared interests.
- **User Flow:**
  - `User types:` `/connect <interest>`
  - `App responds with:` A message listing other users who have the same interest.
  - `Buttons:` Each user listed will have a button to "DM" them.
- **Example:** A user types `/connect Bolt.new` and the app displays a list of all other users who have "Bolt.new" as an interest, with an option to message them.

### 2. Speaker Q&A Modal 🗣️

- **Description:** A modal interface for attendees to submit questions for speakers.
- **User Flow:**
  - `Action Trigger:` An organizer or moderator triggers the Q&A after a session.
  - `App posts:` A message in the `#speaker-sessions` channel with a "Ask a Question" button.
  - `Button Click:` Clicking the button opens a modal with a text field for the question.
  - `Submission:` Upon submitting, the question is posted to a private `#speaker-qa` channel for the speaker to review.
- **Requirement:** The question submission should include the user's name to give the speaker context.

### 3. Personalized App Home 🏠

- **Description:** A personalized dashboard within the Slack App Home tab.
- **Features:**
  - Displays the user's name and a welcome message.
  - Shows a list of their current interests.
  - Includes a prominent "Update My Interests" button.
- **User Flow:**
  - `User clicks:` The "Conference Connect" app icon.
  - `App Home opens:` The personalized dashboard is displayed.
  - `Update Interests:` Clicking the button opens a modal where the user can add or remove interests. This updates the data used by the `/connect` command.

## 🎨 6. Technical Requirements & Stack

- **Framework:** Bolt for JavaScript
- **Platform:** Slack API (Events, Slash Commands, Interactivity)
- **Database:** In-memory key-value store (for the demo)
- **Hosting:** Local development environment for the on-stage demo.

## 📈 7. Success Metrics

- **Usage:** Number of times the `/connect` command is used.
- **Engagement:** Number of questions submitted via the Q&A modal.
- **Adoption:** Percentage of attendees who open and interact with the App Home tab.

## ⏰ 8. Timeline (For On-Stage Demo)

- **Act 1:** Setup & `/connect` command (5 minutes)
- **Act 2:** Speaker Q&A modal (10 minutes)
- **Act 3:** Personalized App Home (10 minutes)
- **Act 4:** Final polish and Q&A (5 minutes)

## 🚧 9. Out of Scope (For MVP)

- Database persistence (will use in-memory for the demo).
- User authentication beyond what Slack provides.
- Direct messaging or real-time chat functionality.
- Integration with external conference platforms (e.g., website, ticketing).
- Analytics dashboard for organizers.