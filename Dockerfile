FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json to working directory
COPY package.json .

# Install dependencies
RUN yarn install

COPY . .

# Expose port 3000
EXPOSE 3500

# Start the app
CMD ["yarn", "start"]