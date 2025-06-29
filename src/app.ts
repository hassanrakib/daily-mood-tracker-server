import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import 'dotenv/config'

// express app instance
const app = express();

// application level middlewares that execute for every type of http request
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// root route
app.get('/', (req, res) => {
  res.status(httpStatus.OK).json({ message: 'Server is running!' });
});

export default app;
