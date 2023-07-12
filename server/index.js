import './env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

const whitelist = ['https://www.bucketflix.com', 'https://bucketflix.com'];

if (process.env.NODE_ENV === 'development') {
  whitelist.push('http://localhost:3000');
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use(notFound);
app.use(errorHandler);

connectDB();
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}/ 🚀`
  )
);
