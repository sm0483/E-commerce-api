const express=require('express');
const { registerAdmin, loginAdmin, getAdmin, logoutAdmin ,updateAdmin, updatePassword} = require('../controller/adminController');
const {verifyAdminToken} = require('../middleware/validateToken');
const router=express.Router();

router.route('/auth/register').post(registerAdmin);
router.route('/auth/login').post(loginAdmin);
router.route('/').get(verifyAdminToken,getAdmin);
router.route('/auth/logout').get(logoutAdmin);
router.route('/auth/edit').patch(verifyAdminToken,updateAdmin);
router.route('/auth/edit/password').patch(verifyAdminToken,updatePassword);




module.exports=router;