# Frontend Dockerfile for Company Registration System

FROM node:20-alpine

# Set work directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy project files
COPY frontend/ ./

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the app
CMD ["npm", "run", "preview"]