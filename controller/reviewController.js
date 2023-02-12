const asyncWrapper = require("../error/asyncWrapper");
const Review = require("../models/review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const {reviewValidate,reviewEditValidate}=require('../utils/joiValidate')




const createReview=asyncWrapper(async(req,res)=>{
    const {error}=reviewValidate(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    req.body.user=req.user.id;
    const isPresent=await Review.findOne({product:req.body.product,user:req.user.id});
    if(isPresent) throw new CustomError("Review already present edit it",StatusCodes.CONFLICT)
    const response=await Review.create(req.body);
    res.status(StatusCodes.OK).json(response);
})


const getReviewOfCurrentUser=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    if(!id) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const response=await Review.find({user:id});
    if(!response) throw new CustomError("Data not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(response)
})


const editReview=asyncWrapper(async(req,res)=>{
    const {error}=reviewEditValidate(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const {id}=req.user;
    req.body.user=id;
    const {reviewId}=req.params;
    if(!reviewId) throw new CustomError('reviewId not present',StatusCodes.BAD_REQUEST);
    if(!id) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const updatedData=await Review.findOneAndUpdate({user:id,_id:reviewId},req.body,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData);
})

const deleteReview=asyncWrapper(async(req,res)=>{
    const {reviewId}=req.params;
    if(!reviewId) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const response=await Review.findOneAndDelete({_id:reviewId});
    res.status(StatusCodes.OK).json(response);
})


const getAllReviewOfProduct=asyncWrapper(async(req,res)=>{
    const {productId}=req.query;
    if(!productId) throw new CustomError("Invalid request provide Product id",StatusCodes.BAD_REQUEST);
    const response=await Review.find({product:productId});
    res.status(StatusCodes.OK).json(response)
})

const getReview=asyncWrapper(async(req,res)=>{
    const {reviewId}=req.params;
    if(!reviewId) throw new CustomError("Invalid request",StatusCodes.BAD_REQUEST)
    const response=await Review.findById(reviewId);
    res.status(StatusCodes.OK).json(response);
})



module.exports={
    getReviewOfCurrentUser,
    createReview,
    editReview,
    deleteReview,
    getAllReviewOfProduct,
    getReview 
}

