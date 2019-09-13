const express = require("express"); 

const app = express(); //app是express的实例

app.set("secret","xjhgfjfyghjkfuykm")

const cors = require("cors");
app.use(cors());//处理跨域的模块

app.use(express.json())  // 加上才可使用客服端发过来的数据

// 表示/uploads下的文件都是静态文件（图片）
// app.use("/uploads",express.static(__dirname + "/routes/uploads"))
app.use("/uploads",express.static(__dirname + "/uploads"))


// 连接数据库
require("./plugins/mongoose")(app)
// 引入模型
require("./routes/admin")(app)

app.listen(3000,()=>{
    console.log("http://localhost:3000");
})