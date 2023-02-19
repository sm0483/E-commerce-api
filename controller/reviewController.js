const asyncWrapper = require("../error/asyncWrapper");
const Review = require("../models/review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const {reviewValidate,reviewEditValidate,validateObjectId}=require('../utils/joiValidate')
const Product = require("../models/product");




const createReview=asyncWrapper(async(req,res)=>{
    const {error}=reviewValidate(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const product=await Product.findById(req.body.product);
    if(!product) throw new CustomError("Product not found",StatusCodes.NOT_FOUND);
    const updateProduct={};
    updateProduct.reviewCount=product.reviewCount+1;
    updateProduct.rating=(product.rating+req.body.rating)/updateProduct.reviewCount;
    const updatedProduct=await Product.findOneAndUpdate({_id:req.body.product},updateProduct,{runValidators:true,new:true});
    if(!updatedProduct) throw new CustomError("Product not found",StatusCodes.NOT_FOUND);
    req.body.user=req.user.id;
    const isPresent=await Review.findOne({product:req.body.product,user:req.user.id});
    if(isPresent) throw new CustomError("Review already present edit it",StatusCodes.CONFLICT)
    const response=await Review.create(req.body);
    res.status(StatusCodes.OK).json(response);
})


const getReviewOfCurrentUser=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Review.find({user:id});
    if(!response) throw new CustomError("Data not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(response)
})


const editReview=asyncWrapper(async(req,res)=>{
    const {error}=reviewEditValidate(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const {id}=req.user;
    req.body.user=id;
    const {error:errorId}=validateObjectId({id});
    if(errorId) throw new CustomError(errorId.message,StatusCodes.BAD_REQUEST);
    const {reviewId}=req.params;
    const {error:errorReviewId}=validateObjectId({id:reviewId});
    if(errorReviewId) throw new CustomError(errorReviewId.message,StatusCodes.BAD_REQUEST);
    const data=await Review.findById(reviewId);
    if(!data) throw new CustomError("Product not found",StatusCodes.NOT_FOUND);
    const {product,rating}=data;
    const {rating:productTotalRating,reviewCount}=await Product.findById(product);
    const newRating=(productTotalRating*reviewCount-rating+req.body.rating)/reviewCount;
    const updateProduct=await Product.findOneAndUpdate({_id:product},{rating:newRating},{runValidators:true,new:true})
    const updatedData=await Review.findOneAndUpdate({user:id,_id:reviewId},req.body,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData);
})

const deleteReview=asyncWrapper(async(req,res)=>{
    const {reviewId}=req.params;
    const {error:errorReviewId}=validateObjectId({id:reviewId});
    if(errorReviewId) throw new CustomError(errorReviewId.message,StatusCodes.BAD_REQUEST);
    const {id}=req.user;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const reviewData=await Review.findOne({_id:reviewId,user:id});
    if(!reviewData) throw new CustomError("Review not found",StatusCodes.NOT_FOUND);
    const {product,rating}=reviewData;
    const {rating:productTotalRating,reviewCount}=await Product.findById(product);
    const newCount=reviewCount-1;
    let newRating=0;
    if(!newCount) newRating=0;
    else newRating=(productTotalRating*reviewCount-rating)/newCount;
    const updatedProduct=await Product.findOneAndUpdate({_id:product},{rating:newRating},{runValidators:true,new:true});
    const response=await Review.findOneAndDelete({_id:reviewId,user:id});
    res.status(StatusCodes.OK).json(response);
})


const getAllReviewOfProduct=asyncWrapper(async(req,res)=>{
    const {productId}=req.query;
    const {error}=validateObjectId({id:productId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    if(!productId) throw new CustomError("Invalid request provide Product id",StatusCodes.BAD_REQUEST);
    const response=await Review.find({product:productId});
    res.status(StatusCodes.OK).json(response)
})

const getReview=asyncWrapper(async(req,res)=>{
    const {reviewId}=req.params;
    const {error}=validateObjectId({id:reviewId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
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

