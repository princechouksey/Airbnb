const mongoose = require("mongoose")


const connectDB = ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to db');
        
    } catch (error) {
        console.log('Error in connecting db ---->' ,error);
        
        
    }
}
module.exports = connectDB