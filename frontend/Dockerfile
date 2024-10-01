# Use official Node.js image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the Next.js app's source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
