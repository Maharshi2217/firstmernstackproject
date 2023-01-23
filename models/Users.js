import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
//const bcrypt = require('bcrypt.js');
import jwt  from "jsonwebtoken";

const UserSchema =new mongoose.Schema({
    name:{type:String,
        required:[true,'please provide name'],
        minlength:3,
        maxlength:20,
        trim:true
    },
    email:{type:String,
        required:[true,'please provide email'],
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'Please provide a valid mail '
        }
    },
    password:{type:String,
        required:[true,'please provide password'],
        minlength:6,
        select:false
    },
    lastName:{type:String,
        maxlength:20,
        trim:true,
        default:'lastName'
    },
    location:{type:String,
        maxlength:20,
        trim:true,
        default:'my city'
    }


})

UserSchema.pre('save',async function(){
    if(!this.isModified('password')) return
const salt=await bcrypt.genSalt(10);
this.password= await bcrypt.hash(this.password,salt)
})

UserSchema.methods.createJWT=function(){
   return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword=async function(candidatePassword){
    console.log(candidatePassword+"----"+this.password)
    const isMatch =await bcrypt.compare(candidatePassword,this.password)
    console.log(isMatch)
    return isMatch
}

export default mongoose.model('Users',UserSchema)