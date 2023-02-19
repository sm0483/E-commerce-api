const asyncWrapper = require("../error/asyncWrapper");
const Address = require("../models/address");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const {addressValidate, addressEditValidate,validateObjectId}=require('../utils/joiValidate');




const createAddress=asyncWrapper(async(req,res)=>{
    const validateResponse=addressValidate(req.body);
    if(validateResponse.error) throw new CustomError(validateResponse.error.message,StatusCodes.BAD_REQUEST);
    req.body.user=req.user.id
    const response=await Address.create(req.body);
    res.status(StatusCodes.OK).json(response);
})


const getAddressByUserId=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Address.findOne({user:id});
    if(!response) throw new CustomError("Data not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(response)
})


const editAddress=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    const validateResponse=addressEditValidate(req.body);
    if(validateResponse.error) throw new CustomError(validateResponse.error.message,StatusCodes.BAD_REQUEST);
    req.body.user=id;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const updatedData=await Address.findOneAndUpdate({user:id},req.body,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData);
})

const deleteAddress=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Address.findOneAndDelete({user:id});
    res.status(StatusCodes.OK).json(response);
})


module.exports={
    getAddressByUserId,
    createAddress,
    editAddress,
    deleteAddress,
}

