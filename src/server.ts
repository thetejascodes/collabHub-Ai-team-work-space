import express from 'express'
import {connectDB} from './config/db.js'
import  app  from './app.js'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT? process.env.PORT : 8080;


const serverStart = async()=>{
    await connectDB();
    app.listen(port,()=>{
    console.log(`Server is started 🚀 on ${port}`)
});
}

serverStart();