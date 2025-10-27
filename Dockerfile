# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# --- Stage 1: Development ---
FROM base AS dev
# Install all deps (including devDependencies)
RUN pnpm install
# Copy source code
COPY . .
# Expose NestJS default port
EXPOSE 3000
# Run in dev mode with hot reload
CMD ["pnpm", "run", "start:dev"]

# --- Stage 2: Build stage ---
FROM base AS build
RUN pnpm install
COPY . .
RUN pnpm run build

# --- Stage 3: Production ---
FROM node:20-alpine AS prod
WORKDIR /app
RUN npm install -g pnpm
# Copy only necessary files from build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
# Install only production deps and ignore prepare scripts
RUN pnpm install --prod --ignore-scripts
EXPOSE 3000
CMD ["node", "dist/main.js"]
