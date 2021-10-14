FROM node:14

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY babel.config.js .
COPY .eslintignore .
COPY .eslintrc.js .
COPY .prettierrc .
COPY scripts .
COPY package.json .
COPY yarn.lock .

RUN yarn

EXPOSE 3000
CMD [ "yarn", "start" ]