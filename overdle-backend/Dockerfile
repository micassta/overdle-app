FROM node:22

WORKDIR /home/overdle

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3001

CMD [ "node", "/home/overdle/index.js" ]