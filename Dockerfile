FROM node:16.15.0-bullseye-slim

RUN apt-get update && \
    apt-get install -y git

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
COPY .env* .
COPY index.d.ts .

# The yarn install script compiles contracts in the postinstall step, so we need this
COPY src src

RUN yarn

EXPOSE 3000
CMD [ "yarn", "start" ]
