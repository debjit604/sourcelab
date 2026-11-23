# SourceLab Recon Service Dockerfile
# Based on official Playwright Noble image with Chromium pre-installed
FROM mcr.microsoft.com/playwright:v1.49.0-noble

# Set environment
ENV NODE_ENV=production \
    PORT=4000 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy dependency specifications
COPY services/recon/package.json ./package.json

# Install dependencies (Playwright is already pre-installed in base image)
RUN pnpm install --prod=false

# Copy source code and configuration
COPY services/recon/src ./src
COPY lib/analyzers ./src/lib/analyzers

# Create non-root directories and set permissions for pwuser
RUN chown -R pwuser:pwuser /app

# Switch to non-root Playwright user
USER pwuser

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => { if (r.statusCode !== 200) process.exit(1); });"

EXPOSE 4000

# Start server using tsx
CMD ["pnpm", "start"]
