const joi = require("joi");

const registerValidation=(data)=> {
  const schema = joi.object({
    name: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
}

const loginValidation=(data)=>{
  const schema = joi.object({
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
}

const updateUserValidation=(data)=>{
  const schema=joi.object({
    email:joi.string().min(6).email(),
    name: joi.string().min(4).required()
  })
  return schema.validate(data);
}

const updatePasswordValidation=(data)=>{
  const schema=joi.object({
    password: joi.string().min(6).required(),
  })
  return schema.validate(data);
}


const productValidate=(data)=>{
  const schema=joi.object({
    name: joi.string().required(),
    description:joi.string().required().max(50),
    brand:joi.string().required(),
    price:joi.number().integer().required().min(2),
    stockCount:joi.number().integer().required().min(0),
    isFeatured:joi.boolean().required(),
    category: joi.string().hex().length(24).required()
  })
  return schema.validate(data);
}

const productEditValidate=(data)=>{
  const schema=joi.object({
    name: joi.string(),
    description:joi.string().max(50),
    brand:joi.string(),
    price:joi.number().integer().min(2),
    stockCount:joi.number().integer().min(0),
    isFeatured:joi.boolean(),
    category: joi.string().hex().length(24)
  })
  return schema.validate(data);
}

const categoryValidate=(data)=>{
  const schema=joi.object({
    name:joi.string().required(),
    color:joi.string().required()
  })
  return schema.validate(data);
}

const editCategoryValidate=(data)=>{
  const schema=joi.object({
    name:joi.string(),
    color:joi.string()
  })
  return schema.validate(data);
}


const addressValidate=(data)=>{
  const schema=joi.object({
    address:joi.string().required(),
    city:joi.string().required(),
    pin:joi.string().required(),
    country:joi.string().required(),
    country:joi.string().required(),
    phone: joi.string().pattern(/^\d{10}$|^\d{3}[- ]\d{3}[- ]\d{4}$/).required(),
  })
  return schema.validate(data);
}

const addressEditValidate=(data)=>{
  const schema=joi.object({
    address:joi.string(),
    city:joi.string(),
    pin:joi.string(),
    country:joi.string(),
    country:joi.string(),
    phone: joi.string().pattern(/^\d{10}$|^\d{3}[- ]\d{3}[- ]\d{4}$/),
  })
  return schema.validate(data);
}


const orderValidate=(data)=>{
  const schema=joi.object({
    orderItems:joi.array().items(joi.object({
      quantity:joi.number().integer().required().min(1),
      product:joi.string().hex().length(24).required()
    })).required()
  })
  return schema.validate(data);
}

// {
//   "product": "63e89ac6566a7f735f92a22f",
//   "rating": 4,
//   "review": "I really liked this product! It was easy to use and did exactly what I needed it to do."
// }


const reviewValidate=(data)=>{
  const schema=joi.object({
    product:joi.string().hex().length(24).required(),
    rating:joi.number().integer().required().min(1).max(5),
    review:joi.string().required()  
  }) 
  return schema.validate(data);
}

const reviewEditValidate=(data)=>{
  const schema=joi.object({
    rating:joi.number().integer().min(1).max(5),
    review:joi.string()  
  }) 
  return schema.validate(data);
}

const validateObjectId=(data)=>{
  const schema=joi.object({
    id:joi.string().hex().length(24).required()
  })
  return schema.validate(data);
}

module.exports = { registerValidation, 
  loginValidation,updateUserValidation,updatePasswordValidation,
  productValidate,productEditValidate,categoryValidate,editCategoryValidate,
  addressValidate,addressEditValidate,orderValidate,reviewValidate,reviewEditValidate,
  validateObjectId
};
