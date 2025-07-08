const User  = require("../models/user.model")
const cookie = require("cookie")
const CustomError = require("../utils/customError");
const cacheClient = require("../services/cache.services");
const jwt = require("jsonwebtoken");
const {resetPasswordTemplate} = require("../utils/emailTemplate")
const sendMail = require("../utils/email")
const bcrypt = require("bcrypt");
const generateAuthToken = require("../models/user.model");



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
       
    
       res.cookie("token", token, {
        httpOnly: true, // only accessible by the web server 
        secure: true,         
        sameSite: "None",
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
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
        });
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
       const jwtExpiry = 24 * 60 * 60; // 1 day
        const blackListToken = await cacheClient.set(token, "blacklisted", "EX", jwtExpiry);
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
    }
    catch (error) {
  next(new CustomError(error.message, 500));
}

}

const updateUserProfileController = async (req,res,next)=>{
    try {
      const   {username, email, phone, address, newPassword} = req.body;
     

      const user  =await  User.findOne({email})

        if(!user) {
            return res.status(400).json({message: "User not found"})
        }
        if(username) user.username = username;
        if(email) user.email = email;
        if(phone) user.phone = phone;
        if(address) user.address = address;

        


       let newToken = null;
       if (newPassword) {
       newToken = await user.generateAuthToken();
       user.password = newPassword;
      }

        await user.save();
        if(!newToken) {
            return next(new CustomError("error while generating new jwt token", 400));
        }
       res.cookie("token", newToken, {
       httpOnly: true,
       secure: true,
       sameSite: "None",
       maxAge: 24 * 60 * 60 * 1000,
});
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
        console.log(process.env.JWT_RAW_SECRET);
        const rawToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
            expiresIn: "10m",
          });

          const resetLink = `http://localhost:5173/reset-password/${rawToken}`;
         
          const emailTemplate = resetPasswordTemplate(email , resetLink);
          await sendMail(email, "Reset password", emailTemplate);

         
          res.status(200).json({
            success: true,
            message: "reset password link shared on your gmail",
          });




    } catch (error) {
        next(new CustomError(error.message, 500));
        
    }
}


// POST /api/user/reset-password/:token
const resetPasswordController = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    console.log(token, newPassword);

    if (!newPassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_RAW_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //  Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(400).json({
      message: err.message === "jwt expired"
        ? "Reset link expired. Please try again."
        : "Invalid or expired token.",
    });
  }
};



module.exports ={ registerUserController, loginUserController, logoutUserController, currentUserController
    , updateUserProfileController, resetUserPasswordController , resetPasswordController 
}
