FROM node:14

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
COPY .env .
COPY index.d.ts .

RUN yarn

EXPOSE 3000
CMD [ "yarn", "start" ]
