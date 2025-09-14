# Stage 1: Builder
FROM node:alpine AS builder

# Install deps for sharp, etc. (many Next.js projects need these)
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy only package files first (better cache usage)
COPY package.json yarn.lock ./

# Install dependencies
RUN corepack enable && yarn install --frozen-lockfile

# Copy rest of the source
COPY . .

# Build Next.js app
RUN yarn build

# Stage 2: Runner
FROM node:alpine AS runner

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile --production

# Copy necessary files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["yarn", "start"]
