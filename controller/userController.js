// login 
// register
// edit user
// delete user
// get use

const asyncWrapper = require("../error/asyncWrapper");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const { createJwt,tokenValid} = require("../utils/jwt");
const tokenType=require('../constants/tokenType');
const { hashPassword } = require("../utils/bcrypt");



const registerUser=asyncWrapper(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name) throw new CustomError("Name should be present",StatusCodes.BAD_REQUEST);
    if(!email) throw new CustomError("Email should be present",StatusCodes.BAD_REQUEST);
    if(!password) throw new CustomError("Password should be present",StatusCodes.BAD_REQUEST);

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
    if(!email || !password) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
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
    delete req.body.password;
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
    if(!password) throw new CustomError("New password not present",StatusCodes.BAD_REQUEST);
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    password=await hashPassword(password);
    const response=await User.findOneAndUpdate({_id:id},{password},{runValidators:true,new:true});
    console.log(response);
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