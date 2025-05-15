FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/main"]
