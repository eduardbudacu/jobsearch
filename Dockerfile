FROM node:12.14.1-buster-slim

WORKDIR /app

COPY . .

RUN apt-get update -y && apt-get upgrade -y && \
    apt-get install -y bash git openssh-client

RUN apt-get install -y curl

RUN npm install

EXPOSE $PORT

CMD ["node", "server.js"]