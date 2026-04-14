FROM node:18-alpine
WORKDIR /app

# Install the 'serve' package globally to serve static files
RUN npm install -g serve

# Copy package files and install dependencies
COPY package*.json ./
# Using legacy-peer-deps since we had a minor peer conflict previously
RUN npm install --legacy-peer-deps

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Cloud Run defaults to port 8080
EXPOSE 8080

# Serve the 'dist' folder on port 8080, routing all requests to index.html (-s)
CMD ["serve", "-s", "dist", "-p", "8080"]
