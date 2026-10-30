# Small official Node.js base image
FROM node:20-alpine

# All app files live in /app inside the container
WORKDIR /app

# Copy dependency list first so Docker can cache the npm install layer
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
