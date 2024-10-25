import bcrypt from 'bcrypt';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbName = process.env.POSTGRES_DB || 'mydb';
const dbUser = process.env.POSTGRES_USER || 'user';
const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
const dbPort = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432;

// Пример использования переменных окружения для подключения к базе данных
const dbConfig = {
  host: dbHost,
  database: dbName,
  user: dbUser,
  password: dbPassword,
  port: dbPort,
};

console.log('Database configuration:', dbConfig);

const pool = new Pool(dbConfig);

export const register: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
    res.status(500).json({ error: (error as Error).message });
  }
};