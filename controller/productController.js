const asyncWrapper = require("../error/asyncWrapper");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const {productValidate, productEditValidate, validateObjectId} =require("../utils/joiValidate");


const getAllProduct=asyncWrapper(async(req,res)=>{
    const productData=await Product.find({});
    res.status(StatusCodes.OK).json(productData);
})


const createProduct=asyncWrapper(async(req,res)=>{
    const validateResponse=productValidate(req.body);
    if(validateResponse.error) throw new CustomError(validateResponse.error.message,StatusCodes.BAD_REQUEST);
    const response=await Product.create(req.body);
    res.status(StatusCodes.OK).json(response);
})


const getProductById=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Product.findById(id);
    if(!response) throw new CustomError("Data not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(response)
})


const editProduct=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const validateResponse=productEditValidate(req.body);
    if(validateResponse.error) throw new CustomError(validateResponse.error.message,StatusCodes.BAD_REQUEST);
    const updatedData=await Product.findOneAndUpdate({_id:id},req.body,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData);
})

const deleteProduct=asyncWrapper(async(req,res)=>{
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const response=await Product.findOneAndDelete({_id:id});
    res.status(StatusCodes.OK).json(response);
})


const uploadImage=asyncWrapper(async(req,res)=>{
    const {id:_id}=req.params;
    const {error}=validateObjectId({id:_id});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const {image,images}=req.body;
    const data={image,images}
    if(!_id) throw new CustomError("Bad Request",StatusCodes.BAD_REQUEST);
    const updatedData=await Product.findOneAndUpdate({_id},data,{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(updatedData)
})


//search data using category data
const getProductByCategory=asyncWrapper(async(req,res)=>{
    if(!req.query) throw new CustomError("Invalid query",StatusCodes.BAD_REQUEST);
    if(req.query.catId){
        req.query._id=req.query.catId;
        delete req.query.catId;
        const {error}=validateObjectId({id:req.query._id});
        if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    }
    const searchData=await Product.find({}).populate({
        path:'category',
        match:req.query
    }).exec((err,products)=>{
        if(err) throw new CustomError("Invalid query",StatusCodes.BAD_REQUEST);
        res.status(StatusCodes.OK).json(products)
    });

})

// const getProductByCategoryId=asyncWrapper(async(req,res)=>{
//     const _id=req.params.catId;
//     // const {error}=validateObjectId(_id);
//     // if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
//     res.status(StatusCodes.OK).json(_id)
//     // if(!_id) throw new CustomError("Category id not present ",StatusCodes.BAD_REQUEST);
//     // const searchData=await Product.find({category:_id}).populate('category');
//     // res.status(StatusCodes.OK).json(searchData)
// })



module.exports={
    getAllProduct,
    createProduct,
    getProductById,
    editProduct,
    deleteProduct,
    uploadImage,
    getProductByCategory,
}

