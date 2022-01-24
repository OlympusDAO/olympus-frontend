# Docker image for the frontend
FROM --platform=amd64 node:14.18.3-bullseye-slim

### Dependency Installation
# Otherwise puppeteer will complain about it not being available for arm64
RUN apt-get update && \
    apt-get install -y \
    # lingui compilation
    git \
    # Required by the sleep package
    python3 g++ make

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
COPY index.d.ts .

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=15s --start-period=10s --retries=3 CMD curl -f http://localhost:3000/ || exit 1

# Run the frontend by default
# NOTE: this requires the root directory to be mounted when the Docker image runs
# See tests/docker-compose.yml for an example
ENTRYPOINT yarn run start
