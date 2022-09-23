const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/models.js");


const authing = async (req,res,next) => {
    try{
        const token = req.cookies.token;
        const verifyUser = jwt.verify(token, "thisissecret");
        const user = await userModel.findOne({_id: verifyUser._id});
        req.token = token;
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).send({error: "Please authenticate"});
    }

}


module.exports = authing;