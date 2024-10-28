FROM node:20.18.0-alpine  

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]
# в .env меняем хост postgres с POSTGRES_HOST=localhost на POSTGRES_HOST=postgres