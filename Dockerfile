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
COPY --from=build /opt/app/drizzle ./drizzle

RUN useradd -m discorduser
RUN chown -R discorduser:discorduser /opt/app

USER discorduser

CMD ["npm", "run", "prod"]
