FROM node:22-alpine3.20

WORKDIR /weather-api-nodejs/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/main"]
