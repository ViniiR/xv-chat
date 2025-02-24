FROM node:23.7.0-bullseye AS node-build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#

# FROM nginx:stable-alpine
FROM alpine

RUN apk update

RUN apk add --no-cache brotli nginx-mod-http-brotli

WORKDIR /usr/share/nginx/html

COPY --from=node-build /app /app

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 7924

CMD [ "nginx", "-g", "daemon off;" ]
