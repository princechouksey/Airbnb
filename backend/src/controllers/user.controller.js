const User  = require("../models/user.model")
const cookie = require("cookie")
const CustomError = require("../utils/customError");
const cacheClient = require("../services/cache.services");


const registerUserController  =async (req,res, next)=>{
    const {username, email, password, phone, address} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"})
        }
        const user = await User.create({
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
        const user = await User.authenticateUser(email, password);
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

const updateUserProfileController = async (req,res,next)=>{
    try {
      const   {username, email, phone, address, newPassword} = req.body;
      const user  = User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "User not found"})
        }
        if(username) user.username = username;
        if(email) user.email = email;
        if(phone) user.phone = phone;
        if(address) user.address = address;
        const newToken = null;

        if(password) {
            newToken = await user.generateAuthToken(newPassword)
            user.password = newPassword;
        }

        await user.save();
        if(!newToken) {
            return next(new CustomError("error while generating new jwt token", 400));
        }
        res.cookie("token", newToken)
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user,
            newToken
        })
        
    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }
}




const resetUserPasswordController = async (req,res,next)=>{
    try {
        const {email} = req.body;
        if(!email) {
            return next(new CustomError("email is required", 400));
        }
        const user = await User.findOne({email})
        if(!user) {
            return next(new CustomError("User not found", 400));
        }
        const rawToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
            expiresIn: "10m",
          });
          const resetLink = `http://localhost/api/user/reset-password/${rawToken}`;
          const emailTemplate = resetPasswordTemplate(req.user.userName, resetLink);
          await sendMail("princechouksey179@gmail.com", "Reset password", emailTemplate);
          res.status(200).json({
            success: true,
            message: "reset password link shared on your gmail",
          });




    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }
}
module.exports ={ registerUserController, loginUserController, logoutUserController, currentUserController
    , updateUserProfileController, resetUserPasswordController 
}
