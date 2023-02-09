
const express=require('express');
const {     
    getReviewOfCurrentUser,
    createReview,
    editReview,
    deleteReview,
    getAllReviewOfProduct,
    getReview 
                } = require('../controller/reviewController');
const router=express.Router();
const {verifyUserToken, verifyAdminToken} = require('../middleware/validateToken');


// publc and admin
router.route('/all').get(getAllReviewOfProduct);


//user
router.route('/user').post(verifyUserToken,createReview);
router.route('/user').get(verifyUserToken,getReviewOfCurrentUser);
router.route('/user/:reviewId').delete(verifyUserToken,deleteReview);
router.route('/user/:reviewId').patch(verifyUserToken,editReview);
router.route('/user/:reviewId').get(getReview)




module.exports=router;