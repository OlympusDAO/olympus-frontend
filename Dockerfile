# Docker image for the frontend
FROM --platform=amd64 node:14.18.3-bullseye-slim

### Dependency Installation
# Install this separately, so puppeteer does not install it
# Otherwise puppeteer will complain about it not being available for arm64
RUN apt-get update && \
    apt-get install -y \
    # lingui compilation
    git \
    # Makefile
    cmake \
    # Required by the sleep package
    python3 g++

WORKDIR /usr/src/app

### Yarn Installation
# Yarn would timeout with the material-ui package(s), so we override the timeout
COPY package.json .
COPY yarn.lock .
RUN yarn install --network-timeout 1000000

COPY tsconfig.json .
COPY babel.config.js .
COPY scripts .
COPY gulpfile.js .
# This image is not pushed to a registry, so there shouldn't be an issue with this
COPY .env* ./
COPY index.d.ts .
COPY Makefile .

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=15s --start-period=10s --retries=3 CMD curl -f http://localhost:3000/ || exit 1

# Run the frontend by default
ENTRYPOINT yarn run start
