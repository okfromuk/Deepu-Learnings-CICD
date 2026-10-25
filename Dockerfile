# Start from a small official Node.js runtime image.
FROM node:22-alpine

# Set defaults for the runtime environment inside the image.
ENV NODE_ENV=production
ENV PORT=3000

# Set the directory where application files will live inside the container.
WORKDIR /app

# Copy package metadata; this app uses only Node.js built-ins and needs no install step.
COPY package.json ./

# Copy the application source code into the image.
COPY src ./src

# Run the application as the non-root node user for safer defaults.
USER node

# Document the port the app listens on; this does not publish the port by itself.
EXPOSE 3000

# Start the API when a container launches.
CMD ["npm", "start"]
