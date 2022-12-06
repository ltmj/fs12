FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
