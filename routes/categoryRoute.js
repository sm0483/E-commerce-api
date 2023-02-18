const express=require('express');
const { createCategory,getAllCategory,
    getCategoryById, editCategory, deleteCategory
} = require('../controller/categoryController');
const router=express.Router();
const {verifyAdminToken}=require('../middleware/validateToken');
router.route('/').post(verifyAdminToken,createCategory);
router.route('/').get(getAllCategory);
router.route('/:id').get(getCategoryById).patch(verifyAdminToken,editCategory).delete(verifyAdminToken,deleteCategory);


module.exports=router;