import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import routes from './routes/index.js';
import { env } from './config/env.js';
const app = express();
app.use(helmet());
app.use(cors({
  origin:env.clientUrl,
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('TaskFlow Backend is running');
});

app.use('/api', routes);

export default app;