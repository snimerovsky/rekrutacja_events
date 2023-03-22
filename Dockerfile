FROM node:19.8.1-alpine3.16 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:19.8.1-alpine3.16 as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

FROM node:19.8.1-alpine3.16 as test

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .
