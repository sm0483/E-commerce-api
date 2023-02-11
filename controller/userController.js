// login 
// register
// edit user
// delete user
// get use

const asyncWrapper = require("../error/asyncWrapper");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const { createJwt} = require("../utils/jwt");
const tokenType=require('../constants/tokenType');
const { hashPassword } = require("../utils/bcrypt");
const { registerValidation, loginValidation,
     updateUserValidation,updatePasswordValidation} = require("../utils/joiValidate");



const registerUser=asyncWrapper(async(req,res)=>{
    const {email}=req.body;
    const errorResponse=registerValidation(req.body);
    if(errorResponse.error) throw new CustomError(errorResponse.error.message,StatusCodes.BAD_REQUEST);
    const emailCheck=await User.find({email});
    if(emailCheck.length!==0) throw new CustomError("Email already present",StatusCodes.CONFLICT);
    const response=await User.create(req.body);
    res.status(StatusCodes.OK).json({
        name:response.name,
        email:response.email,
        _id:response._id
    });

})


const loginUser=asyncWrapper(async(req,res)=>{
    const {email,password}=req.body;
    const errorResponse=loginValidation(req.body);
    if(errorResponse.error) throw new CustomError(errorResponse.error.message,StatusCodes.BAD_REQUEST);
    const user = await User.findOne({ email });
    if(!user) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const isValid=await user.comparePassword(password);
    if(!isValid) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const id=user._id.toString();
    const token=createJwt({id,type:tokenType.user},tokenType.user);
    res.status(StatusCodes.OK).json({token})

})



const getUser=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const response=await User.findById(id);
    if(!response) throw new CustomError("No user found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
        name:response.name,
        email:response.email,
        _id:response._id
    })
})

const updateUser=asyncWrapper(async(req,res)=>{
    const{id}=req.user;
    const errorResponse=updateUserValidation(req.body);
    if(errorResponse.error) throw new CustomError(errorResponse.error.message,StatusCodes.BAD_REQUEST);
    if(req.body.email){
        const emailCheck=await User.findOne({email:req.body.email});
        if(emailCheck) throw new CustomError("Mail already present",StatusCodes.CONFLICT);
    }
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const updatedData=await User.findOneAndUpdate({_id:id},req.body,{runValidators:true,new:true});
    if(!updatedData) throw new CustomError("No user found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
        name:updatedData.name,
        email:updatedData.email,
        _id:updatedData._id
    })
})

const updatePassword=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    let {password}=req.body;
    const errorResponse=updatePasswordValidation(req.body);
    if(errorResponse.error) throw new CustomError(errorResponse.error.message,StatusCodes.BAD_REQUEST);  
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    password=await hashPassword(password);
    const response=await User.findOneAndUpdate({_id:id},{password},{runValidators:true,new:true});
    res.status(StatusCodes.OK).json({
        message:"Password successfully updated"
    })
})


const logoutUser=asyncWrapper(async(req,res)=>{
    const accessToken="";
    res.status(StatusCodes.OK).json({accessToken,message:"Logged out"}); 
})




module.exports={
    registerUser,
    loginUser,
    getUser,
    logoutUser,
    updateUser,
    updatePassword
}