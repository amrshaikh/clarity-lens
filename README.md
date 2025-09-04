# ClarityLens 🔍

> Your focused, AI-powered reading experience.

ClarityLens is an open-source web application built for the **Syrotech MVP Hackathon**. It tackles the problem of information overload and digital noise by transforming cluttered web articles into clean, digestible, and accessible summaries.

## The Problem

The modern web is a chaotic environment. Essential information is often buried under a sea of advertisements, distracting pop-ups, complex navigation, and poorly formatted text. This creates a significant barrier to learning and information access, especially for users with visual impairments, attention deficits, or those simply seeking a focused reading session.

## The Solution

ClarityLens acts as a signal through the noise. By pasting any article URL, users can leverage the power of Google's Gemini AI to generate a structured, easy-to-read summary. The application strips away all non-essential elements and presents the core content in a serene, customizable interface, making knowledge more accessible and enjoyable for everyone.

## Key Features

  * **🧠 AI-Powered Summarization:** Utilizes the Google Gemini API to generate a structured summary, including a main heading, a descriptive paragraph, key bullet points, and a neutral concluding opinion.
  * **✨ Clutter-Free Reading:** Removes all ads, navigation, and other distractions, allowing you to focus solely on the content that matters.
  * **🎨 Customizable Themes:** Switch between Light, Dark, and Sepia modes to match your reading preference and reduce eye strain.
  * **🔊 Text-to-Speech:** An integrated screen reader lets you listen to the summarized article, perfect for multitasking or auditory learning.
  * **📱 Fully Responsive Design:** A clean, mobile-first design ensures a seamless experience on any device, from a phone to a desktop.

## Live Demo

**[Try ClarityLens Live!](insert_link)**

## Tech Stack

The project is built with modern, open-source technologies.

| **Component** | **Technology** |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **AI Model** | Google Gemini API (`gemini-1.5-flash`) |
| **Parsing** | Mozilla Readability.js |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## Getting Started

To run this project locally, follow these steps:

**Prerequisites:**

  * Node.js (v18 or later)
  * Git

**1. Clone the repository:**

```
git clone https://github.com/amrshaikh/clarity-lens.git
cd clarity-lens
```

**2. Set up the Backend:**

```
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file
touch .env

# Add your Google Gemini API Key to the .env file
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env
```

**3. Set up the Frontend:**

```
# Navigate to the client directory from the root
cd ../client

# Install dependencies
npm install
```

**4. Run the Application:**

  * **Start the backend server:** In a terminal, from the `server` directory, run:
    ```
    node server.js
    ```
  * **Start the frontend server:** In a *second* terminal, from the `client` directory, run:
    ```
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Future Enhancements

ClarityLens is a strong foundation, and future development could include:

  * **Browser Extension:** For one-click summarization directly on any article page.
  * **User Accounts:** To save and organize past summaries.
  * **More Customization:** Allow users to choose different fonts and text sizes.

## Author

Created by **Amr** - [GitHub Profile](https://github.com/amrshaikh)