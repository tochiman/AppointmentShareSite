FROM node:18.9.1-alpine

WORKDIR /app
COPY ./ ./
RUN yarn install --no-progress