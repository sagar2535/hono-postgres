# Use official Bun image
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package files first for caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Use a lightweight final image for production
FROM oven/bun:latest AS runner

# Set the working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app /app

# Expose the application's port (update as needed)
EXPOSE 3000

# Run the application in production mode
CMD ["bun", "run", "src/config/app.ts"]
