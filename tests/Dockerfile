FROM --platform=amd64 node:14.18.2-bullseye-slim

# Install this separately, so puppeteer does not install it
# Otherwise puppeteer will complain about it not being available for arm64
RUN apt-get update && \
    apt-get install -y \
    chromium \
    xvfb \
    git \
    # Puppeteer dependencies
    # Source: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix
    ca-certificates \
    fonts-liberation \
    # Replacement for libappindicator3-1
    libayatana-appindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

WORKDIR /usr/src/app

# TODO consider splitting package.json for tests only
COPY package.json .
COPY yarn.lock .

# Yarn would timeout with the material-ui package(s), so we override the timeout
RUN yarn install --network-timeout 1000000 --frozen-lockfile

COPY Makefile .

ENTRYPOINT make e2e_run
