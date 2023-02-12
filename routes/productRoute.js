const express=require('express');
const { createProduct,getAllProduct,getProductById, editProduct, deleteProduct, uploadImage, getProductByCategory

} = require('../controller/productController');
const imageGen = require('../middleware/imageGen');
const router=express.Router();
const {verifyAdminToken} = require('../middleware/validateToken');


router.route('/').post(verifyAdminToken,createProduct);
router.route('/').get(getAllProduct);
router.route('/:id').get(getProductById).patch(verifyAdminToken,editProduct).delete(verifyAdminToken,deleteProduct).post(verifyAdminToken,imageGen,uploadImage);

module.exports=router;