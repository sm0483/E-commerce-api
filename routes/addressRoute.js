
const express=require('express');
const { createAddress 
    ,editAddress, getAddressByUserId,deleteAddress} = require('../controller/addressController');
const router=express.Router();
const {verifyUserToken} = require('../middleware/validateToken');

router.route('/').post(verifyUserToken,createAddress);
router.route('/').get(verifyUserToken,getAddressByUserId);
router.route('/').patch(verifyUserToken,editAddress);
router.route('/').delete(verifyUserToken,deleteAddress);



module.exports=router;