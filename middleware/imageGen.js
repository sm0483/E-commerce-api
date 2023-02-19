const asyncWrapper = require("../error/asyncWrapper");

const {
    StatusCodes,
    getReasonPhrase
}=require('http-status-codes');
const CustomError = require("../error/custom");
const uploadFile = require("../utils/cloudinary");
const { validateObjectId } = require("../utils/joiValidate");


const imageGen=asyncWrapper(async(req,res,next)=>{
    let url=undefined;
    const {id}=req.params;
    const {error}=validateObjectId({id});
    if(error) throw new CustomError("product id not  valid",StatusCodes.BAD_REQUEST);
    try {
        if(!req.files) throw new CustomError("image not present",StatusCodes.BAD_REQUEST);
        if(!req.files.image) throw new CustomError("Thumbnail image not present",StatusCodes.BAD_REQUEST);
        if(!req.files.images) throw new CustomError("Elaborated images are not present",StatusCodes.BAD_REQUEST);
        if(Array.isArray(req.files.images)){
           const images=[];
           let imageLink=null;
            for(singleImage of req.files.images){
                imageLink=await uploadFile(singleImage);
                images.push(imageLink)
            }
            if(req.files.image){
                url=await uploadFile(req.files.image)
            }
            req.body={
                image:url,
                images
            }
            return next();
        }else {
            throw new CustomError("There should be more then two images",StatusCodes.BAD_REQUEST);
        }
    } catch (error) {
        throw new CustomError(error.message,StatusCodes.BAD_GATEWAY);
    }
 
})


module.exports=imageGen;