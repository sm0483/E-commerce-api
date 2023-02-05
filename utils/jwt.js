const jwt=require('jsonwebtoken');
const {admin,user}=require('../constants/tokenType');

const createJwt=(payload,type)=>{
    let token=null
    if(type===admin) token=jwt.sign({payload},process.env.ACCESS_TOKEN,{
        expiresIn: process.env.LIFETIME,

    });
    if(type===user) token=jwt.sign({payload},process.env.ACCESS_TOKEN,{
        expiresIn: process.env.LIFETIME,
    });
    return token;
}


const tokenValid=(token,type)=>{
    let isValid=false;
    if(type===admin) isValid=jwt.verify(token,process.env.ACCESS_TOKEN);
    if(type===user) isValid=jwt.verify(token,process.env.ACCESS_TOKEN);
    return isValid;
}




module.exports={
    createJwt,
    tokenValid
}