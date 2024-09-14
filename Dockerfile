# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 5015
EXPOSE 5015

# Command to run the application in development mode
CMD ["npm", "run", "dev"]