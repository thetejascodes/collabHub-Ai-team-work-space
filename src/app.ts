import express from 'express'
const app = express();

app.use(express.json())

app.get('/health',(req,res)=>{
    res.send(`API is healthy`)
})


export default app;