import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURI=process.env.MONGO_URI;
const connectDB=async()=>{
    try {
        if(!mongoURI){
            throw new Error('Mongo URI is missing');
        }
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error.message);
    }
}
export default connectDB;