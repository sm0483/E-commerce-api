const express=require('express');
const { registerUser, loginUser, getUser, logoutUser ,updateUser, updatePassword} = require('../controller/userController');
const {verifyUserToken} = require('../middleware/validateToken');
const router=express.Router();

router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser);
router.route('/').get(verifyUserToken,getUser);
router.route('/auth/logout').get(logoutUser);
router.route('/auth/edit').patch(verifyUserToken,updateUser);
router.route('/auth/edit/password').patch(verifyUserToken,updatePassword);




module.exports=router;