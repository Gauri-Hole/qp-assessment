# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Expose port 3000
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run app.js when the container launches
CMD ["node", "app.js"]
