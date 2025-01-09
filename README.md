# EmotiChat

EmotiChat is a mental health assistant web application designed to provide AI-driven support for managing depression and improving mental well-being. This application features an AI chatbot, progress tracking, and secure user authentication, making it a personal and private companion for users.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development Notes](#development-notes)
- [License](#license)

---

## Features

- AI-powered chatbot for mental health assistance.
- Progress tracking to monitor and reflect on mental health improvements.
- Secure authentication using **Passport.js** and **JWT**.
- Responsive and intuitive user interface built with **React** and **Bootstrap**.
- RESTful API backend powered by **Node.js** and **Express**.
- Database integration using **MongoDB** for private and secure data storage.

---

## Technologies Used

### Frontend
- **React**: Library for building the UI.
- **Bootstrap**: For styling and responsive design.
- **Joi**: Input validation for forms.

### Backend
- **Node.js**: Runtime environment for the backend.
- **Express.js**: Web framework for creating the REST API.
- **Passport.js**: Authentication middleware.
- **JWT**: Token-based secure sessions.
- **Mongoose**: MongoDB object modeling.

### Database
- **MongoDB**: NoSQL database for data storage.

---

## Getting Started

To access the project locally for development purposes, follow these steps.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: [Download MongoDB](https://www.mongodb.com/)
- A package manager like **npm** or **yarn**.

---

## Installation

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

## Development Notes

### Security & Privacy
- Since EmotiChat is intended for monetization and privacy is critical:
  - Ensure .env files are never pushed to the repository.
  - Use HTTPS and encryption for all user data during deployment.
  - Monitor dependencies for vulnerabilities using tools like npm audit.

### Monetization Plans
- This project is private and not intended for public use at this stage.
- Future monetization plans may include subscription models or licensing for businesses.

### License
The source code for EmotiChat is proprietary and all rights are reserved. No part of this codebase may be reproduced, distributed, or transmitted without prior written permission from the author.

### Contact
For inquiries, feel free to contact:

- Sebastian Lian Carmagnola
- GitHub: https://github.com/sebastianlian
- LinkedIn:https://www.linkedin.com/in/sebastiancarmagnola/

