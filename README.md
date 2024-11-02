# Setellite Full-Stack Docker Swarm

Full-stack application built with TypeScript, using Next.js for the frontend, NestJS for the backend, and Blueprint for styling. The backend exposes a RESTful API secured with JWT authentication.

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
