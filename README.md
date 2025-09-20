Dilse - AI Therapy Application
It's not just an AI that you can share your thoughts, it's your 3 AM friend that helps you sort out your way over everyone

Dilse is a compassionate AI therapist web application designed to provide accessible and private mental wellness support. Built on this platform, it offers a seamless user experience with features such as guided therapy, session tracking, and personalized insights.

✨ Core Features
AI-Powered Chat: Engage in conversations with an empathetic AI therapist in either text or voice mode.
Dual Therapy Modes: Choose between "Classic" (free-form chat) and "Guided" (structured therapy) sessions.
Progressive User Onboarding: A step-by-step sign-up process to personalize the user's experience.
Session Reports & History: After each session, receive a summary with mood analysis, key topics, and recommended activities. Review all past sessions in a dedicated log of history.
Personal Insights: A dashboard that visualizes mood trends, activity, and common discussion topics over time.
Light & Dark Theme Support: Users can switch between themes for their visual comfort.
🚀 Tech Stack
Frontend: React.js
Styling: Tailwind CSS
UI Components: shadcn/ui
Icons: Lucide React
Platform: Built and deployed on the cloud platform.
📁 Project Structure
The project is organized into logical directories based on its function within the base44 ecosystem.

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
│   └── (Directory for reusable React components)
│
└── Layout.js
File Explanations
Path	Description
entities/	Contains .json files that define the data schemas for the application's database. This is where the structure of User and Session data is specified.
pages/	Contains the main React components for each page of the application (e.g., the Home page, Dashboard, Chat interface).
components/	Intended for smaller, reusable React components that can be imported and used across different pages to avoid code repetition.
Layout.js: A special React component that acts as a wrapper for all pages. It contains shared UI elements like the header, navigation bar, and handles the overall page layout.


This project is designed to run directly on the platform, which handles the entire backend, database, and deployment pipeline.

How to Run: The application is always live. Any changes I make are automatically built and reflected in the preview window. There are no commands for you to run.
Running Locally (After Exporting the Code)
You can export the frontend code from the base44 platform to run it on your local machine.

❗️ Important Note: The exported code is a frontend-only React application. Features that rely on the base44 backend (like user authentication, saving sessions, or fetching history) will not work out-of-the-box. To make them work, you would need to build your own backend API and modify the frontend code to call your API endpoints instead of the base44 SDK functions.

If you wish to run the frontend for UI development purposes, follow these steps:

Download the Project: Export and download the project source code as a ZIP file and unzip it.

Install Dependencies: Open a terminal in the project's root directory and run:

npm install
Run the Development Server: Once the installation is complete, start the local server:

npm start
This will open the application in your browser, usually at http://localhost:3000.
