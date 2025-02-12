# Use official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN bun install --no-lockfile

# Copy the rest of the application files
COPY . .

# Expose the dynamic Render port
EXPOSE 4000

# Start the server
CMD ["bun", "run", "src/config/server.ts"]
