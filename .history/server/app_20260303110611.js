import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to My Wallet API');
});
