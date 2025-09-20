

# Dilse - AI Therapy Application

**Dilse** is more than just an AI chatbot — it’s your compassionate 3 AM friend that helps you navigate your thoughts, emotions, and mental wellness. This web application provides private, accessible, and empathetic therapy support through AI-powered interactions.

---

## 🌟 Core Features

* **AI-Powered Chat**: Converse with an empathetic AI therapist via text or voice.
* **Dual Therapy Modes**:

  * **Classic**: Free-form chat to share thoughts naturally.
  * **Guided**: Structured therapy sessions for focused mental wellness.
* **Progressive User Onboarding**: Step-by-step sign-up process to tailor the user experience.
* **Session Reports & History**: Receive session summaries with mood analysis, key discussion topics, and recommended activities. Review all past sessions in a dedicated history log.
* **Personal Insights**: Dashboard visualizing mood trends, common discussion topics, and activity over time.
* **Light & Dark Theme Support**: Switch between themes for visual comfort.

---

## 🚀 Tech Stack

* **Frontend**: React.js
* **Styling**: Tailwind CSS
* **UI Components**: shadcn/ui
* **Icons**: Lucide React
* **Platform**: Hosted and deployed on the cloud

---

## 📁 Project Structure

```
/
├── entities/
│   ├── User.json
│   └── Session.json
│
├── pages/
│   ├── Home.js
│   ├── Auth.js
│   ├── Onboarding.js
│   ├── Dashboard.js
│   ├── Chat.js
│   ├── SessionReport.js
│   ├── History.js
│   └── Insights.js
│
├── components/
│   └── (Reusable React components)
│
└── Layout.js
```

**Directory Explanations:**

* **entities/**: Defines the data schemas for the application (User and Session).
* **pages/**: Main React components for each page (Home, Dashboard, Chat, etc.).
* **components/**: Reusable React components to avoid code repetition.
* **Layout.js**: Wrapper component containing shared UI elements like headers and navigation.

---

## 🖼️ Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/95943e64-e45d-402b-83af-fa8bd324bdb8)
![Screenshot 2](https://github.com/user-attachments/assets/caaeb904-108a-4540-aa5d-f6db03e08fc0)
![Screenshot 3](https://github.com/user-attachments/assets/4f42a725-ec07-4353-a230-6ff501faf29a)

---

## ⚡ How to Run

### Online

The application runs live on the cloud platform. Any changes you make are automatically reflected — no commands needed.

### Running Locally (Frontend Only)

> Note: Features relying on the base44 backend (authentication, session saving, history) will **not** work. You would need to implement your own backend to fully restore functionality.

1. **Download the Project**: Export the project from base44 and unzip it.
2. **Install Dependencies**:

```bash
npm install
```

3. **Run Development Server**:

```bash
npm start
```

This will launch the app in your browser (usually at `http://localhost:3000`).

---

## 💡 Notes

* Dilse is built to provide **emotional support** and is **not a substitute for professional therapy**.
* The exported frontend code can be customized for UI/UX purposes, but backend integration is needed for full functionality.

---


