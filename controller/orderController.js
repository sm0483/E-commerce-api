const OrderItem = require("../models/orderItem");
const Order=require("../models/order");
const Address =require("../models/address");
const Product= require("../models/product");
const asyncWrapper = require("../error/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const orderItem = require("../models/orderItem");
const {createJwt}=require("../utils/jwt");
const tokenType=require('../constants/tokenType')
const {orderValidate}=require('../utils/joiValidate')


// {
// 	"orderItems": [
// 		{
// 			"quantity": "2",
// 			"productId": "2"
// 		},
// 		{
// 			"quantity": "2",
// 			"productId": "3"
// 		}
// 	],
// 	"addressId": "3",
// 	"userId": "4"
// }


// orderItems : [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'OrderItem',
//     required: true,
// }],
// address:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:'Address',
//     required:true
// },
// user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
// },
// status: {
//     type: String,
//     required: true,
//     default: 'Pending'
// },
// totalPrice: {
//     type: Number
// },
// dateOrdered: {
//     type: Date,
//     default: Date.now
// },
// paymentDetails:{
//     type:Boolean,
//     default:false
// }

// const getOrderByUserId=asyncWrapper(async(req,res)=>{
//     const {userId}=req.params;
//     if(!userId) throw new CustomError("Id not present",StatusCodes.BAD_REQUEST);
//     const response=await Order.find({user:userId});
//     res.status(StatusCodes.OK).json(response)
// })

const createOrder=asyncWrapper(async(req,res)=>{
    const errorResponse=orderValidate(req.body);
    if(errorResponse.error) throw new CustomError(errorResponse.error.message,StatusCodes.BAD_REQUEST);
    let list=[];
    let totalPrice=0;
    if(req.body.orderItems.length===0)throw new CustomError("Can't proceed without items" ,StatusCodes.BAD_REQUEST);

    const attachId=async()=>{
        try {  
            const savePromises = req.body.orderItems.map(async(item)=>{
                const data=new OrderItem(item);
                return data.save();
            });
            const savedOrderItems = await Promise.all(savePromises);
            list = savedOrderItems.map(item => item._id.toString());   
        } catch (error) {
            throw new CustomError("Invalid product id",StatusCodes.BAD_REQUEST);
        }
    };
    
    await attachId();

    const getTotalPrice=async()=>{
        try{
            const getPrice=list.map(async(id)=>{
                const priceData=await orderItem.findById(id).populate('product','price');
                console.log(priceData.product.price);
                return priceData.product.price*priceData.quantity;
            })

            const priceList=await Promise.all(getPrice);
            totalPrice=priceList.reduce((a,b)=>a+b,0);
        }catch(err){
            throw new CustomError("Invalid product id",StatusCodes.BAD_REQUEST)
        }
    }

    await getTotalPrice();
    const address=await Address.findOne({user:req.user.id});
    if(!address) throw new CustomError("update address and create order",StatusCodes.CONFLICT);

    let response=await Order.create({
        orderItems:list,
        totalPrice,
        address:address._id,
        user:req.user.id
    });

    const paymentToken=await createJwt({totalPrice,orderId:response._id},tokenType.user);
    return res.status(200).json({response,paymentToken});
})

const getAllOrder=asyncWrapper(async(req,res)=>{
    const response=await Order.find({});
    res.status(StatusCodes.OK).json(response)
})



const getOrderByCurrentUser=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    if(!id) throw new CustomError("Token not present",StatusCodes.BAD_REQUEST);
    const response=await Order.find({user:id});
    res.status(StatusCodes.OK).json(response)
})


const cancelOrder=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    if(!id) throw new CustomError("Token not present or expired",StatusCodes.BAD_REQUEST);
    const {orderId}=req.params;
    if(!orderId) throw new CustomError("Give a orderId",StatusCodes.BAD_REQUEST);
    const response=await Order.findOneAndUpdate({user:id,_id:orderId},{status:'canceled'},{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(response);
})


const getOrderById=asyncWrapper(async(req,res)=>{
    const {orderId}=req.params;
    if(!orderId) throw new CustomError("Token not present",StatusCodes.BAD_REQUEST);
    const response=await Order.findOne({_id:orderId,user:req.user.id});
    res.status(StatusCodes.OK).json(response);
})

const getOrderByIdAdmin=asyncWrapper(async(req,res)=>{
    const {userId,orderId}=req.query;
    const filter={};
    if(userId) filter.user=userId;
    if(orderId) filter._id=orderId;
    if(!req.query) throw new CustomError("Invalid query",StatusCodes.OK);
    const response=await Order.find(filter).populate("user") .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          select:'name'
        }
      });
    res.status(StatusCodes.OK).json(response)
})


// getOrderByUserId,

module.exports={
    createOrder,
    getAllOrder,
    getOrderByCurrentUser,
    cancelOrder,
    getOrderById,
    getOrderByIdAdmin
}

