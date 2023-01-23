import express from 'express'
import cors from 'cors'
import notFoundMiddleWare from './middleware/NotFound.js'
import errorHandlerMiddleWare from './middleware/ErrorHandler.js'
import dotenv from 'dotenv'
import 'express-async-errors'
import connectDB from './db/connect.js'
import authRouter from './router/authRouter.js'
import jobsRouter from './router/jobsRouter.js'
import authenticateUser from './middleware/auth.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser'

dotenv.config()
import morgan from 'morgan'


const app=express()
//import notFoundMiddleWare from './middleware/NotFound'


if(process.env.NODE !== 'production')
{
    app.use(morgan('dev'))
}
//app.use(cors())

const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')));



app.use(express.json())
//app.use(cookieParser())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get('/',(req,res)=>{
    //throw new Error('error')
    res.json({msg:"welcome"})
})

app.get('/api/v1',(req,res)=>{
    //throw new Error('error')
    res.json({msg:"api welcome"})
})

app.use('/api/v1/auth',authRouter)

app.use('/api/v1/jobs',authenticateUser,jobsRouter)

// only when ready to deploy
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

//app.use('/api/v1/jobs',jobsRouter)



//app.use()

app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleWare)

const port=process.env.port||5000


const start = async ()=>{
    try{
        console.log(process.env.MONGO_URL)
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{
            console.log(`serevr is running ${port}`)
        })
    }catch(error){ console.log(error)}
}

start()
              