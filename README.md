# 🤖 EmotiChat: Your AI-Powered Mental Health Companion

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)

![Bootstrap](https://img.shields.io/badge/Styling-Bootstrap-purple?style=for-the-badge&logo=bootstrap)

![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)

![Express](https://img.shields.io/badge/API-Express-black?style=for-the-badge&logo=express)

![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)

![Passport](https://img.shields.io/badge/Auth-Passport.js-orange?style=for-the-badge&logo=passport)

![JWT](https://img.shields.io/badge/Auth-JWT-blueviolet?style=for-the-badge&logo=jsonwebtokens)

![Chart.js](https://img.shields.io/badge/Charts-Chart.js-ff6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

![Google Cloud NLP](https://img.shields.io/badge/NLP-Google%20Cloud-yellow?style=for-the-badge&logo=googlecloud)

![Claude AI](https://img.shields.io/badge/AI-Claude-9cf?style=for-the-badge)

EmotiChat is a secure, AI-driven web application built to assist individuals managing **depression**, **anxiety**, and general mental well-being. Featuring a conversational chatbot, personalized progress tracking, and strong data privacy, EmotiChat offers users a personal and private space to reflect and grow.

---

## 📚 Table of Contents

- ✨ [Features](#-features)
- 🛠️ [Technologies Used](#️-technologies-used)
- 🚀 [Getting Started](#-getting-started)
- ⚙️ [Installation](#️-installation)
- 🧠 [Development Notes](#-development-notes)
- 📄 [License](#-license)
- 📬 [Contact](#-contact)

---

## ✨ Features

💬 **AI-Powered Chatbot**: Conversational assistant for emotional support and daily reflection.
📈 **Mood & Progress Tracking**: Log emotional states and track changes over time.
🔐 **Secure Authentication**: Role-based access using **Passport.js** and **JWT**.
🧑‍🤝‍🧑 **Customizable User Preferences**: Support for user-defined pronouns and personalization.
🖥️ **Responsive UI**: Built with **React** and **Bootstrap** for modern device compatibility.
🌐 **RESTful Backend**: Clean API architecture using **Node.js** and **Express.js**.
🧠 **Real-Time Sentiment Analysis**: Powered by **Google NLP** and **Claude AI**.

---

## 🛠️ Technologies Used

### 💻 Frontend
- **React** – Component-based UI library.
- **Bootstrap** – Responsive and accessible styling framework.
- **Joi** – Schema-based input validation.

### 🔧 Backend
- **Node.js** – JavaScript runtime.
- **Express.js** – API routing and server framework.
- **Passport.js** – Flexible authentication middleware.
- **JWT (JSON Web Token)** – Session security and user verification.
- **Google Cloud Natural Language API** – Sentiment analysis.
- **Claude AI** – Conversational AI assistant.
- **Sci-kit, Pickle, Pandas** - Build the emotion labeling system.

### 🗃️ Database
- **MongoDB** – NoSQL database for storing user profiles, messages, and analytics.
- **Mongoose** – ODM for structuring and querying MongoDB collections.

### 📊 Visualizations
- **Chart.js** - Data visualization of emotional trends.

---

## 🚀 Getting Started

To run EmotiChat locally:

### 🔍 Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- npm

---

## ⚙️ Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:your-username/emotichat.git
2. Navigate to the project directory:
   ```bash
   cd EmotiChat
3. Install dependencies
   ```bash
   npm install
4. Set up a .env file in the backend directory and the frontend directory with the following variables:
    ```bash
   DB_URI=your_mongo_database_url
    JWT_SECRET=your_jwt_secret
    PORT=5000
5. Start the development server:
    ```bash
   npm start

## 🧠 Development Notes

### 🔒 Security & Privacy
- Since EmotiChat is intended for monetization and privacy is critical:
  - Ensure .env files are never pushed to the repository.
  - Use HTTPS and encryption for all user data during deployment.
  - Monitor dependencies for vulnerabilities using tools like npm audit.

### 💡 Monetization Plans
- This project is private and not intended for public use at this stage.
- Future monetization plans may include subscription models or licensing for businesses.

### 📄 License
The source code for EmotiChat is proprietary and all rights are reserved. 
No part of this codebase may be reproduced, distributed, or transmitted without 
prior written permission from the author.

## 🎥 Project Demo
Check out the full demo on YouTube: [Watch here](https://youtu.be/4C2bSYtqemA?si=ScgMI4hzLFCF-ZMW)

## 📬 Contact
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/sebastiancarmagnola)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sebastianlian)

📧 [sebastianlian@emotichat.tech](mailto:sebastianlian@emotichat.tech)


_Thanks for checking out EmotiChat – empowering mental wellness through technology._
