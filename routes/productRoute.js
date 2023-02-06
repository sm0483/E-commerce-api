const express=require('express');
const { createProduct,getAllProduct,getProductById, editProduct, deleteProduct, uploadImage, getProductByCategory

} = require('../controller/productController');
const imageGen = require('../middleware/imageGen');
const router=express.Router();

router.route('/').post(createProduct);
router.route('/').get(getAllProduct);
router.route('/:id').get(getProductById).patch(editProduct).delete(deleteProduct).post(imageGen,uploadImage);

module.exports=router;