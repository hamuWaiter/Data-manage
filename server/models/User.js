const mongoose = require("mongoose")

var Schema = mongoose.Schema;

// 分类模型
var mySchema = new Schema({

    username:{type: String},
    // 通过bcrypt散列加密 密码
    password:{
        type: String,
        select:false,  //表示在后台管理员界面不显示密码字段

        set(val){  //val表示设置的未加密密码
        // 返回加密后的密码
            return require("bcrypt").hashSync(val,10)
        }
    }

});

// 导出Category集合，文档模板是mySchema。。。。
module.exports = mongoose.model("User",mySchema);