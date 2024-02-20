FROM node:20-alpine3.18

WORKDIR /home/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5574

CMD ["npm", "run", "dev"]