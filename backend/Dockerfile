# Используем базовый образ Node.js на основе Alpine
FROM node:14-alpine

# Установка необходимых пакетов
RUN apk update && apk add --no-cache postgresql-client curl

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Указываем порт, который будет использоваться приложением
EXPOSE 4000

# Команда для запуска приложения
CMD ["npm", "start"]