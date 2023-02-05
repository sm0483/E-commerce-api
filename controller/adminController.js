// login 
// register
// edit user
// delete user
// get use

const asyncWrapper = require("../error/asyncWrapper");
const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const { createJwt,tokenValid} = require("../utils/jwt");
const tokenType=require('../constants/tokenType');
const { hashPassword } = require("../utils/bcrypt");




const registerAdmin=asyncWrapper(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name) throw new CustomError("Name should be present",StatusCodes.BAD_REQUEST);
    if(!email) throw new CustomError("Email should be present",StatusCodes.BAD_REQUEST);
    if(!password) throw new CustomError("Password should be present",StatusCodes.BAD_REQUEST);

    const emailCheck=await Admin.find({email});
    if(emailCheck.length!==0) throw new CustomError("Email already present",StatusCodes.CONFLICT);
    const response=await Admin.create(req.body);
    res.status(StatusCodes.OK).json({
        name:response.name,
        email:response.email,
        _id:response._id
    });

})


const loginAdmin=asyncWrapper(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const admin = await Admin.findOne({ email });
    if(!admin) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const isValid=await admin.comparePassword(password);
    if(!isValid) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const id=admin._id.toString();
    const token=createJwt({id,type:tokenType.admin},tokenType.admin);
    res.status(StatusCodes.OK).json({token})

})



const getAdmin=asyncWrapper(async(req,res)=>{
    const {id}=req.admin;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const response=await Admin.findById(id);
    if(!response) throw new CustomError("No admin found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
        name:response.name,
        email:response.email,
        _id:response._id
    })
})
const updateAdmin=asyncWrapper(async(req,res)=>{
    const{id}=req.admin;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const updatedData=await Admin.findOneAndUpdate({_id:id},req.body,{runValidators:true,new:true});
    if(!updatedData) throw new CustomError("No admin found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json({
        name:updatedData.name,
        email:updatedData.email,
        _id:updatedData._id
    })
})


const updatePassword=asyncWrapper(async(req,res)=>{
    const {id}=req.admin;
    let {password}=req.body;
    if(!password) throw new CustomError("New password not present",StatusCodes.BAD_REQUEST);
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    password=await hashPassword(password);
    const response=await Admin.findOneAndUpdate({_id:id},{password},{runValidators:true,new:true});
    res.status(StatusCodes.OK).json({
        message:"Password successfully updated"
    })
})



const logoutAdmin=asyncWrapper(async(req,res)=>{
    const accessToken="";
    res.status(StatusCodes.OK).json({accessToken,message:"Logged out"}); 
})




module.exports={
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    updateAdmin,
    getAdmin,
    updatePassword
}