import express from 'express';
import cors from 'cors';
const app = express();

// 💡 Crucial: Configure CORS middleware
var corsOptions = {
  origin: 'http://localhost:4200', // Only allow your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// ... rest of your routes