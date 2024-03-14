const mongoose = require('mongoose')

dbConnect = ()=>{
    try {
       const connection =  mongoose.connect(process.env.Mongodb_URL).then(
        console.log("Connected to mongoDB successfully")
       )
        
    } catch (error) {
        console.log("We got an database error" ,error)
    }
}

module.exports = dbConnect