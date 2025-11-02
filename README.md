# Smart Communication Hub Documentation

## Overview

This repository contains the **backend** for the CodeQuests challenge.
It’s built using **NestJS** and provides all necessary APIs and database integrations for the application.

The backend can be run either using **Docker** (recommended for development) or locally by connecting to an external PostgreSQL database.

## Environment Variables

All environment-specific values are stored in a `.env` file.

### ⚠️ Important:

Before starting the app, **you must create a `.env` file** at the project root.

To make setup easy, there’s a `.env.example` file.
Duplicate it and rename the copy to `.env`:

```bash
cp .env.example .env
```

Then, fill in your configuration details:

```env
NODE_ENV="development"

# Database Configuration
DB_CA_CERT="optional"
DB_USERNAME=nest_user
DB_PASSWORD=nest_pass
DB_NAME=nest_db
DB_PORT=5432
DB_HOST=db

# JWT Configuration
JWT_SECRET="some_secret"
JWT_EXPIRES_IN=360000 # in milliseconds

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10

## Openai Configuration
OPENAI_API_KEY="key"
```

## Running the Project

You can run the backend in two different ways:

---

### Option 1: Using Docker (Recommended for Development)

This is the easiest way since it automatically sets up PostgreSQL and the backend together.

#### 1️ Build and start containers:

```bash
docker-compose up --build
```

#### 2️ Access the app:

- API: [http://localhost:3000](http://localhost:3000)
- PostgreSQL: accessible on port **5432**

To stop the containers:

```bash
docker-compose down
```

---

### Option 2: Run Without Docker

If you already have a PostgreSQL instance running, you can connect to it directly.

#### 1️ Configure `.env`:

Make sure your `.env` has the correct external database credentials.

#### 2️ Install dependencies:

```bash
pnpm install
```

#### 3️ Run database migrations (Only for production):

```bash
pnpm run migration:run
```

#### 4️ Start the application:

```bash
pnpm start:dev
```

The backend will run on:

```
http://localhost:3000
```

## API Documentation

Once the backend is running, you can explore the API using the built-in Swagger documentation available at:

**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This page provides a complete overview of all available endpoints, request/response formats, and example payloads.
It’s automatically generated from the NestJS decorators and updates whenever you modify your controllers.

---

### AI-Powered Insights

The application includes an AI Insights feature that automatically generates concise summaries of user conversations using OpenAI’s GPT model.

#### How It Works

- The service retrieves a conversation and its messages from the database.
- It then sends the full conversation text to the OpenAI API.
- The AI model (gpt-4o-mini) summarizes the discussion in a neutral and concise tone.
- The generated summary is saved as an Insight entity and linked to the conversation for later retrieval.

#### ⚠️ Important:

`Insights are only created once for the conversation by one of the users`

## Running Tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment (Render + GitHub Actions)

The project uses **GitHub Actions** to automatically deploy to **Render.com** whenever code is pushed to the `main` branch.

### GitHub Action Workflow

Located in `.github/workflows/deploy.yml` the workflow contains:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      deployments: write

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Render
        uses: JorgeLNJunior/render-deploy@v1.4.6
        with:
          service_id: ${{ secrets.RENDER_SERVICE_ID }}
          api_key: ${{ secrets.RENDER_API_KEY }}
          clear_cache: true
          wait_deploy: true
          github_deployment: true
          deployment_environment: 'production'
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Secrets

These secrets are required for deployment to Render:

| Secret Name         | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `RENDER_SERVICE_ID` | The unique ID of your Render service                         |
| `RENDER_API_KEY`    | The API key for Render (for authentication)                  |
| `GITHUB_TOKEN`      | Automatically provided by GitHub for workflow authentication |

Once configured, every push to `main` will trigger a deployment to Render.

---

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Socket:** Socket.io
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Containerization:** Docker
- **Package Manager:** pnpm
- **Testing:** Jest

---

## Useful Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm start:dev`  | Run the app in development mode      |
| `pnpm build`      | Compile the TypeScript project       |
| `pnpm start:prod` | Run the built app in production mode |
| `pnpm test`       | Run tests                            |
| `pnpm lint`       | Run linter                           |

---

## License

This project is licensed under the [MIT License](LICENSE).
