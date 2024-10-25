

import dotenv from 'dotenv';
import path from 'path';

// Загрузка переменных окружения из файла .env, который находится уровнем выше (для запуска DOCKR COMPOSE/SWARM в режиме продакшен)
// Определение пути к файлу .env в зависимости от среды
const envFilePath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '.env')
  : path.resolve(__dirname, '../../.env');

// Загрузка переменных окружения из соответствующего файла .env
dotenv.config({ path: envFilePath });

import { json } from 'body-parser';
import express from 'express';
import authRoutes from './routes/auth';


const app = express();

app.use(json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});