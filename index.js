import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './db.js';
import authRouter from './router/userAuth.js';
import notesRouter from './router/userNotes.js';
dotenv.config();
const app=express();
connectDB();
app.use(express.json());
app.use(cors({
    origin:"*"
}));
app.use('/api/auth',authRouter);
app.use('/api/notes',notesRouter);
app.get('/',(req,res)=>{
    return res.send('Hello from express');
})
app.listen(5000,()=>{
    console.log('Server is running on port 5000');
})