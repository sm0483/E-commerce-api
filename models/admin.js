const mongoose=require('mongoose');
const bcrypt = require('bcrypt');


const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name should be present']
    },
    email:{
        type:String,
        required:[true,'Email for admin should be present'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password field should be present']
    }
},{timestamps:true});


adminSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


adminSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};


const Admin=mongoose.model("Admin",adminSchema);

module.exports=Admin;

