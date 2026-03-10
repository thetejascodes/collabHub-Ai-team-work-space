import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("mongo db connected successfully")
    } catch (error) {
        console.error("database connection failed")
    }
};