FROM node:22-slim

WORKDIR /app
COPY ./package*.json .
RUN npm install --loglevel verbose

EXPOSE 8080

VOLUME /app

CMD node --env-file=.env.dev --watch index.js