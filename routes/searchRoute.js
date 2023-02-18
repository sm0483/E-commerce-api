const express=require('express');
const 
{ getProductByCategory,getProductByCategoryId
    } = require('../controller/productController');
const router=express.Router();

router.route('/by-category').get(getProductByCategory)
// router.route('/by-category/:catId').get(getProductByCategoryId);


module.exports=router;

