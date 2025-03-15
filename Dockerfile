# Node.js'in en güncel LTS sürümünü kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları ve kodları kopyala
COPY package*.json ./
RUN npm install

# Kodu içeri al
COPY . .

# Uygulamanın çalışacağı portu belirle
EXPOSE 3000

# Başlangıç komutu
CMD ["npm", "start"]
