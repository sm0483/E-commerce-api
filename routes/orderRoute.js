
const express=require('express');
const {     
    createOrder,
    getAllOrder, //admin
    // getOrderByUserId, //admin
    getOrderByCurrentUser, //user
    cancelOrder, //user
    getOrderById,
    getOrderByIdAdmin
                } = require('../controller/orderController');
const router=express.Router();
const {verifyUserToken, verifyAdminToken} = require('../middleware/validateToken');




router.route('/admin').get(verifyAdminToken,getAllOrder);
router.route('/admin/search').get(verifyAdminToken,getOrderByIdAdmin)

//user
router.route('/').post(verifyUserToken,createOrder);
router.route('/').get(verifyUserToken,getOrderByCurrentUser);
router.route('/:orderId').delete(verifyUserToken,cancelOrder);
router.route('/:orderId').get(verifyUserToken,getOrderById);



module.exports=router;