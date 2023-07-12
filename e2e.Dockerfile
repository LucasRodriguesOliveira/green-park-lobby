FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn add bcrypt

COPY . .

EXPOSE 3001

CMD [ "yarn", "test:e2e" ]