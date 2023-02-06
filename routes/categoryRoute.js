const express=require('express');
const { createCategory,getAllCategory,
    getCategoryById, editCategory, deleteCategory
} = require('../controller/categoryController');
const router=express.Router();

router.route('/').post(createCategory);
router.route('/').get(getAllCategory);
router.route('/:id').get(getCategoryById).patch(editCategory).delete(deleteCategory);


module.exports=router;