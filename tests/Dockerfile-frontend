FROM --platform=amd64 node:14.18.2-bullseye-slim

# Install this separately, so puppeteer does not install it
# Otherwise puppeteer will complain about it not being available for arm64
RUN apt-get update && \
    apt-get install -y chromium git

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY babel.config.js .
COPY .eslintignore .
COPY .eslintrc.js .
COPY .prettierrc .
COPY scripts .
COPY gulpfile.js .
COPY package.json .
COPY yarn.lock .
# This image is not pushed to a registry, so there shouldn't be an issue with this
COPY .env* .
COPY index.d.ts .

# The yarn install script compiles contracts in the postinstall step, so we need this
COPY src src

# Yarn would timeout with the material-ui package(s), so we override the timeout
RUN yarn install --network-timeout 1000000

EXPOSE 3000

# Run the frontend by default
ENTRYPOINT yarn start
