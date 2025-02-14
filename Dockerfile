# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the project
RUN npm run build || exit 1

# Production stage
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

# Install production dependencies only
RUN npm install --production --legacy-peer-deps

# Set default port
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 