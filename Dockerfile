# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Set BACKEND_URL as a build argument and environment variable
ARG BACKEND_URL
ENV BACKEND_URL=${BACKEND_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

# Install production dependencies only
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the server
CMD ["node", "./dist/server/entry.mjs"] 