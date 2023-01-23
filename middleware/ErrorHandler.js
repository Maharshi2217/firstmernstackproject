
import {  StatusCodes } from "http-status-codes"

const errorHandlerMiddleWare =(err,req,res,next)=>{
    console.log(err)
    const defaultError ={
        StatusCode:err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message || 'Something went wrong'
    }
    if(err.name==='ValidationError'){
        defaultError.StatusCode=StatusCodes.BAD_REQUEST
        //defaultError.msg=err.message
        defaultError.msg=Object.values(err.errors).map((item)=>item.message).join(',')

    }
    if(err.code && err.code ===11000){
        defaultError.StatusCode=StatusCodes.BAD_REQUEST
        defaultError.msg=`${Object.keys(err.keyValue)}field has to be unique`
    }
    res.status(defaultError.StatusCode).json({msg:defaultError.msg})
    //res.status(defaultError.StatusCode).json({msg:err})
}

export default errorHandlerMiddleWare