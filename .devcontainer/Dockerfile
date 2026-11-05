FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && npx -y playwright@1.64.1 install-deps chromium \
 && rm -rf /var/lib/apt/lists/*
