# Node.js'in en güncel LTS sürümünü kullan
FROM node:18-alpine


WORKDIR /app


COPY package*.json ./
RUN npm install -g jest  # Jest'i global olarak yükle
RUN npm install

# Kodu içeri al
COPY . .


EXPOSE 3000

CMD ["npx", "jest", "--json", "--outputFile=test-results.json"]
