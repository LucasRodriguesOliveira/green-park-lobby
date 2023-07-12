FROM node:16
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN yarn
RUN yarn add bcrypt

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]