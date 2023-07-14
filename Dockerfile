FROM node:16
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock

RUN yarn
RUN yarn add bcrypt
RUN yarn add -D @swc/cli @swc/core

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "node", "dist/main" ]
