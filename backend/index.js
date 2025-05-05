require('dotenv').config();
const app = require("./src/app")


const connectDB = require("./src/config/db/db")
connectDB()

const PORT = process.env.PORT || 4000

app.listen(PORT , ()=>{
    console.log('Listening in port', PORT);
    
})