module.exports = app =>{
    const mongoose = require("mongoose");
    const db = mongoose.connection;

    mongoose.connect('mongodb://localhost:27017/game-app',{ 
        useNewUrlParser: true
    })

    db.on("open",()=>{
        console.log("数据库连接成功！")
    })
    db.on("close",()=>{
        console.log("数据库已关闭！")
    })
}