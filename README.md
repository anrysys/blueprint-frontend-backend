# Blueprint Full Stack Application with Docker Compose/Swarm

Full-stack application built with TypeScript, using Next.js for the frontend, NestJS for the backend, and Blueprint for styling. The backend exposes a RESTful API secured with JWT authentication.

## Functional Overview

This project is a comprehensive full-stack application designed to provide a robust and scalable solution for modern web development. The application includes the following key features:

- **User Authentication and Authorization**: Secure user authentication using JWT tokens, with support for registration, login, and token refresh.
- **Push Notifications**: Integration with web push notifications, allowing users to subscribe and unsubscribe from notifications.
- **Profile Management**: Users can view and update their profile information, including username and email.
- **Service Worker**: Registration and management of service workers for handling push notifications.
- **Database Integration**: Utilizes PostgreSQL for data storage, with TypeORM for database interactions.
- **Dockerized Deployment**: The entire application is containerized using Docker and orchestrated with Docker Compose/Swarm for easy deployment and scalability.

## Technologies Used

The project leverages a variety of modern technologies and tools to deliver a high-quality development experience:

- **Frontend**:
  - [Next.js](https://nextjs.org/): A React framework for server-side rendering and static site generation.
  - [React](https://reactjs.org/): A JavaScript library for building user interfaces.
  - [TypeScript](https://www.typescriptlang.org/): A strongly typed programming language that builds on JavaScript.
  - [Blueprint](https://blueprintjs.com/): A React-based UI toolkit for the web.
  - [React Toastify](https://fkhadra.github.io/react-toastify/): A library for displaying notifications in React applications.
  - [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API): For handling background tasks and push notifications.

- **Backend**:
  - [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient and scalable server-side applications.
  - [TypeORM](https://typeorm.io/): An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
  - [PostgreSQL](https://www.postgresql.org/): A powerful, open-source object-relational database system.
  - [JWT](https://jwt.io/): For secure user authentication and authorization.
  - [Web Push](https://developers.google.com/web/fundamentals/push-notifications): For sending push notifications to users.

- **DevOps**:
  - [Docker](https://www.docker.com/): For containerizing the application.
  - [Docker Compose](https://docs.docker.com/compose/): For defining and running multi-container Docker applications.
  - [Docker Swarm](https://docs.docker.com/engine/swarm/): For orchestrating Docker containers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Useful Commands](#useful-commands)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/setellite-full-stack-docker-swarm.git
   cd setellite-full-stack-docker-swarm
   ```

2. **Install dependencies for both frontend and backend:**

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

## Running the Application

1. **Set up environment variables:**

   Create a `.env` file in the `backend` directory and fill it with the necessary environment variables. You can use the `.env.example` file as a reference.

   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Start the application using Docker Compose:**

   ```bash
   docker-compose up --build
   ```

   This command will build and start the Docker containers for both the frontend and backend services.

3. **Access the application:**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:4000](http://localhost:4000)

## Environment Variables

The application requires several environment variables to be set. Below is a list of the variables and their descriptions:

- `FRONTEND_URL`: URL of the frontend application (e.g., `http://localhost:3000`)
- `BACKEND_PORT`: Port on which the backend server will run (e.g., `4000`)
- `DB_HOST`: Hostname of the PostgreSQL database (e.g., `localhost`)
- `DB_NAME`: Name of the PostgreSQL database (e.g., `postgres`)
- `DB_USERNAME`: Username for the PostgreSQL database (e.g., `postgres`)
- `DB_PASSWORD`: Password for the PostgreSQL database (e.g., `postgres`)
- `DB_PORT`: Port on which the PostgreSQL database is running (e.g., `5432`)
- `JWT_SECRET`: Secret key for JWT authentication
- `ACCESS_TOKEN_EXPIRED_IN`: Expiration time for access tokens (e.g., `15m`)
- `REFRESH_TOKEN_EXPIRED_IN`: Expiration time for refresh tokens (e.g., `7d`)

## Project Structure

The project is structured as follows:

```bash
setellite-full-stack-docker-swarm/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── posts/
│   │   ├── users/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   ├── public/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Useful Commands

- **Build the project:**

  ```bash
  npm run build
  ```

- **Run the project in development mode:**

  ```bash
  npm run dev
  ```

- **Run tests:**

  ```bash
  npm run test
  ```

- **Lint the project:**

  ```bash
  npm run lint
  ```

- **Format the code:**

  ```bash
  npm run format
  ```
