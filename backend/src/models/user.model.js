const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,        // field is mandatory
        trim: true             // removes whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,          // no duplicate emails
        lowercase: true        // stores email in lowercase
    },
    password: {
        type: String,
        required: true,
        minlength: 6           // basic password length check
    },
    phone: {
        type: Number,
        required: true,
        maxLength:10,
      

    },
    address: {
        type: String,
        default: ""            // default empty if not provided
    }
    ,
    isAdmin: {
        type: Boolean,
        default: false         // default value for admin status
    },
    properties:[],
    bookings :[],
}, {
    timestamps: true           // adds createdAt and updatedAt fields
});

userSchema.pre("save", async function(next){
    if(this.isModified()){
        this.password =await  bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({ id: this._id}, process.env.JWT_SECRET,{
        expiresIn : "1h"
    })
if(!token) throw new Error("error geenrating token");
return token
}

userSchema.statics.authenticateUser = async function (email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("Invalid email or password")
    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid email or password")
        return user;

}


module.exports = mongoose.model("User", userSchema)


