const asyncWrapper = require("../error/asyncWrapper");
const Category = require("../models/category");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const {categoryValidate,editCategoryValidate, validateObjectId}=require('../utils/joiValidate');


const getAllCategory=asyncWrapper(async(req,res)=>{
    const categoryData=await Category.find({});
    res.status(StatusCodes.OK).json(categoryData);
})


const createCategory=asyncWrapper(async(req,res)=>{
    const validateResponse=categoryValidate(req.body);
    if(validateResponse.error) throw new CustomError(validateResponse.error.message,StatusCodes.BAD_REQUEST)
    const response=await Category.create(req.body);
    res.status(StatusCodes.OK).json(response);
})


const getCategoryById=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Category.findById(id);
    if(!response) throw new CustomError("Data not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(response)
})


const editCategory=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const validateResponse=editCategoryValidate(req.body);
    if(validateResponse.error) throw new CustomError(validateResponse.error.message,StatusCodes.BAD_REQUEST)
    const updatedData=await Category.findOneAndUpdate({_id:id},req.body,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData);
})

const deleteCategory=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Category.findOneAndDelete({_id:id});
    res.status(StatusCodes.OK).json(response);
})





module.exports={
    getCategoryById,
    createCategory,
    getAllCategory,
    editCategory,
    deleteCategory,
}

