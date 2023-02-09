const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const root_dir = __dirname.split('src')[0]
dotenv.config({ path: path.join(root_dir, `.env`) });
const {connectDb} = require("./config/db");
const fileUpload = require('express-fileupload');
const xss=require('xss-clean');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit')
const morgan=require('morgan');
const bodyParser = require('body-parser')


app.use(morgan('dev'));







//routes
const userRoute=require("./routes/userRoute");
const adminRoute=require("./routes/adminRoute");
const productRoute=require("./routes/productRoute");
const categoryRoute=require("./routes/categoryRoute");
const searchProductRoute=require("./routes/searchRoute");
const addressRoute=require("./routes/addressRoute");
const orderRoute=require("./routes/orderRoute");

//error handler
const errorHandler = require("./middleware/err");
const pageNotFound = require("./middleware/pageNotFound");

app.use(xss());
app.use(helmet());

app.use(rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, 
}))
app.use(express.json());
app.use(express.static("./public"));
app.use(fileUpload({
  useTempFiles:true,
  limits: { fileSize: 50 * 1024 * 1024 },
}));






app.get('/api/v1/live',(req, res) => {
  return res.status(200).json({ message: "alive" })
})




const start=async()=>{
  try{
      const connect= await connectDb(process.env.MONGO_URI);
      console.log('connected---');
  }catch(err){
      console.log(err);
  }

}

start();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));




app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/search",searchProductRoute);
app.use("/api/v1/address",addressRoute);
app.use("/api/v1/order",orderRoute);




app.use(errorHandler);
app.use(pageNotFound);
