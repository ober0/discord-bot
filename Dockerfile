# Build stage
FROM node:22-slim AS build
WORKDIR /opt/app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build


# Production stage
FROM node:22-slim AS production
WORKDIR /opt/app


COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /opt/app/dist ./dist

RUN addgroup -g 1001 -S nodejs
RUN adduser -S discordbot -u 1001

RUN chown -R discordbot:nodejs /app
USER discordbot

CMD ["npm", "run", "prod"]
