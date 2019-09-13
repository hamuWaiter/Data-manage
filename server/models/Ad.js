const mongoose = require("mongoose")

var Schema = mongoose.Schema;

// 分类模型
var mySchema = new Schema({

    name:{type: String},
    items: [{
        image: { type: String},
        url: { type: String}
    }]

});

// 导出Category集合，文档模板是mySchema。。。。
module.exports = mongoose.model("Ad",mySchema);