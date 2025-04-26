const userModel  = require("../models/user.model")
const cookie = require("cookie")
const CustomError = require("../utils/customError");
const cacheClient = require("../services/cache.services");
const registerUserController  =async (req,res, next)=>{
    const {username, email, password, phone, address} = req.body;
    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"})
        }
        const user = await userModel.create({
            username,
            email,
            password,
            phone,
            address
        })
         const token = await user.generateAuthToken()
        console.log("token--->", token);
    
       res.cookie("token", token, {
        httpOnly: true, // only accessible by the web server,
        sameSite:"none",
       })
        res.status(201).json({
         success: true,
         message: "User registered successfully",
         user,
        }) 
    
    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }
}
const loginUserController = async (req, res,next) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.authenticateUser(email, password);
        const token = await user.generateAuthToken()
        res.cookie("token", token)
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        })
    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }

}
const logoutUserController = async (req, res,next ) => {
    const {token} = req.cookies;
    try {
        if(!token) {
            next(new CustomError("User unauthorized", 401));
        }
        const blackListToken = await cacheClient.set(token, "blacklisted", "EX", 3600);
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })


    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }


}

const currentUserController = async (req,res,next)=>{
    try {
        const user = req.user;
        res.status(200).json({ message: "authentication successfull", user: user });
    } catch (error) {
        
    }
}
module.exports ={ registerUserController, loginUserController, logoutUserController, currentUserController}