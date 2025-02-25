# first stage node.js
FROM node:23.7.0-bullseye AS node-build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# second stage rust
FROM rust:slim-bullseye AS rust-build

WORKDIR /app

COPY Cargo.* .

COPY --from=node-build /app /app

RUN apt-get update -qq && apt-get upgrade -qq

RUN apt-get install -y pkg-config libssl-dev

#

RUN SQLX_OFFLINE=true cargo build --release

# third stage runtime 
# FROM alpine:3.21.3 AS runtime
FROM debian:bullseye-slim AS runtime

WORKDIR /app

COPY --from=rust-build /app /app

EXPOSE 10000

CMD [ "/app/target/release/x_v_server" ]
