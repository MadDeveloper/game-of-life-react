FROM node:9-alpine

RUN mkdir /app
COPY . /app

RUN cd /app && npm install
WORKDIR /app

EXPOSE 3000

CMD npm start