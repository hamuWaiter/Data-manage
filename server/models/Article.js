const mongoose = require("mongoose")

var Schema = mongoose.Schema;

// 分类模型
var mySchema = new Schema({
    title:{type: String},
    categories:[{type : mongoose.SchemaTypes.ObjectId, ref : "Category"}],
    body:{type: String}

});

// 导出Category集合，文档模板是mySchema。。。。
module.exports = mongoose.model("Article",mySchema);