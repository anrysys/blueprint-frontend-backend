import { json } from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth';

// Загрузка переменных окружения из файла .env
dotenv.config();

const app = express();
app.use(json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server-13 is running on port ${PORT}`);
});