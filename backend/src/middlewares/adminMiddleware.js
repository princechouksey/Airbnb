 const jwt = require("jsonwebtoken");
 const User = require("../models/user.model");
const cacheClient = require("../services/cache.services");

 const adminMiddleware = async (req, res, next) => {
    const {token } = req.cookies;

    try {
        if(!token) return res.status(401).json({message: "Unauthorized"});
        const  isBlackListed = await cacheClient.get(token)

        if( isBlackListed(token)) return res.status(401).json({message: "BlackListed Token "});
        const decoded = jwt.verify(tokem , process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized"});
        const user = await User.findById(decoded.id);
        if(!user) return res.status(401).json({message: "User Not Found"});
        if(req.user.isAdmin !== true) return res.status(401).json({message: "Access Denied"});
        req.user = user;
        next()

    } catch (error) {
        next(new CustomError(error.message, 500));

    }
 }
 module.exports = adminMiddleware;
 