# Use the latest LTS version of Node.js
FROM node:18-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


RUN npm install -g jest


RUN npm install jest-json-reporter --save-dev


COPY . .


EXPOSE 3000


CMD ["npx", "jest", "--json", "--outputFile=/app/test-results.json"]