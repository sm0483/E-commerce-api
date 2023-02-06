const asyncWrapper = require("../error/asyncWrapper");
const Category = require("../models/category");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");


const getAllCategory=asyncWrapper(async(req,res)=>{
    const categoryData=await Category.find({});
    res.status(StatusCodes.OK).json(categoryData);
})


const createCategory=asyncWrapper(async(req,res)=>{
    const response=await Category.create(req.body);
    res.status(StatusCodes.OK).json(response);
})


const getCategoryById=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    if(!id) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const response=await Category.findById(id);
    if(!response) throw new CustomError("Data not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(response)
})


const editCategory=asyncWrapper(async(req,res)=>{
    const {id:_id}=req.params;
    delete req.body.images;
    delete req.body.image;
    if(!_id) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const updatedData=await Category.findOneAndUpdate({_id},req.body,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData);
})

const deleteCategory=asyncWrapper(async(req,res)=>{
    const {id:_id}=req.params;
    if(!_id) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const response=await Category.findOneAndDelete({_id});
    res.status(StatusCodes.OK).json(response);
})





module.exports={
    getCategoryById,
    createCategory,
    getAllCategory,
    editCategory,
    deleteCategory,
}

