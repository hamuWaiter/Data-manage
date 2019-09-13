const mongoose = require("mongoose")

var Schema = mongoose.Schema;

// 分类模型
var mySchema = new Schema({
    name: {type: String},
    avatar: {type: String},
    title: {type: String},
    // 英雄定位：
    positions: [{type : mongoose.SchemaTypes.ObjectId, ref : "Category"}],
    scores:{
        // 难度评分 
        difficult: {type: Number},
        // 操作评分 
        skill:{type: Number},
        // 攻击评分
        attack:{type: Number},
        // 生存评分 
        survive:{type: Number}
    },
    // 英雄技能
    skills:[{
        // icon表示图片路径（图片）
        icon: {type: String},
        name: {type: String},
        description:  {type: String},
        tips: {type: String}
    }],
    // 顺风出装:
    items1:[{type : mongoose.SchemaTypes.ObjectId, ref : "Good"}],
    // 逆风出装：
    items2:[{type : mongoose.SchemaTypes.ObjectId, ref : "Good"}],
    // 使用技巧：
    usageTips: {type: String},
    // 对抗技巧：
    battleTips: {type: String},
    // 团战技巧：
    teamTips: {type: String},
    // 契合英雄：
    partners: [{
        hero: {type : mongoose.SchemaTypes.ObjectId, ref : "Hero"},
        description: {type: String}
    }]
});

// 导出Category集合，文档模板是mySchema。。。。
module.exports = mongoose.model("Hero",mySchema);