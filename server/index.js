import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}/ 🚀`
  )
);
