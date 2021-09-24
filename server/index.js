import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(router);

connectDB();
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}/ 🚀`
  )
);
