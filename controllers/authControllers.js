import { nextTick } from "process"
import Users from "../models/Users.js"
import { StatusCodes } from "http-status-codes"
import {BadRequestError, UnAuthenticatedError} from '../errors/index.js'
import attachCookies from "../utils/attachCookies.js"

const register= async (req,res)=>{

    const {name,email,password}=req.body
    if(!name || !email || !password)
    {
    
        throw new BadRequestError("Please provide all values")

    }
    const userAlreadyExist= await Users.findOne({email}).select("+password")
    if(userAlreadyExist)
    {
        throw new BadRequestError('Email already exists')
    }
        const user=await Users.create(req.body)
        const token=user.createJWT()
        attachCookies(res,token)
        res.status(StatusCodes.OK).json({user:{email:user.email,lastName:user.lastName,location:user.location,name:user.name},token})
}

const login=async (req,res)=>{
    const {email,password}=req.body
    if(!email || !password)
    {
        throw new BadRequestError("Provide all details")
    }
    const user=await Users.findOne({email}).select('+password')
    console.log(user)
    if(!user)
    {
        throw new UnAuthenticatedError("Invalid creds")

    }
    console.log(password)
    const isPassWordCorrect=await user.comparePassword(password)
    console.log(isPassWordCorrect)
    if(!isPassWordCorrect)
    {
        throw new UnAuthenticatedError('InValid Creds')
    }
    const token=user.createJWT()
    attachCookies(res,token)

    res.status(StatusCodes.OK).json({user,token,location:user.location})
}

const updateUser=async (req,res)=>{
    console.log("request body ")
    console.log(req.body)
    const {email,name,lastName,location}=req.body
    if(!email || !name || !lastName || !location) 
    {
        throw new BadRequestError("Provide all details")
    }
    const user=await Users.findOne({_id:req.user.userId})
    user.email=email
    user.name=name
    user.lastName=lastName 
    user.location=location
    await user.save()
    const token=user.createJWT()
    attachCookies(res,token)
    res.status(StatusCodes.OK).json({user,token,location:user.location})
}

export {register,login,updateUser}