import { UnAuthenticatedError } from "../errors/index.js"
import jwt from 'jsonwebtoken'

const auth = async(req,res,next)=>{
    const headers=req.headers
    const authheader=req.headers.authorization
    if(!authheader || !authheader.startsWith('Bearer'))
    {
        console.log("hi")
        throw new UnAuthenticatedError('Authentication Invalid')
    }
    const token=authheader.split(' ')[1]
    /*const token=req.cookies.token 
    if(!token)
    {
        throw new UnAuthenticatedError('Authentication Invalid')  
    }*/
    try{
        console.log(token)
        console.log(process.env.JWT_SECRET)
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        console.log(payload)
        req.user={userId:payload.userId}
        next()
    }catch(error){
        console.log("hi")
        throw new UnAuthenticatedError('Authentication Invalid')

    }
    
}

export default auth