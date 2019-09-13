<template>
    <div>
        <!-- 根据是否传入id决定页面是新建分类还是编辑分类 -->
        <h1>{{id ? "编辑": "新建"}}英雄</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            
            <el-tabs value="basics">
                <el-tab-pane label="基础信息" name="basics">
                    <el-form-item label="英雄名称">
                        <el-input v-model="model.name"></el-input>
                    </el-form-item>
                    <el-form-item label="头像">
                        <!-- 提交图片到  $http.defaults.baseURL+'/upload' -->
                        <el-upload
                        class="avatar-uploader"
                        :action="$http.defaults.baseURL+'/upload'"
                        :headers="getAuthorization()"
                        :show-file-list="false"
                        :on-success="afterUpload"
                        >
                        <img v-if="model.avatar" :src="model.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="英雄称号">
                        <el-input v-model="model.title"></el-input>
                    </el-form-item>
                    <el-form-item label="英雄定位">
                        <el-select v-model="model.positions" placeholder="请选择" multiple>
                            <el-option
                            v-for="item in heroPosition"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="难度等级">
                        <!-- 星级评分 -->
                        <el-rate :max="10" show-score v-model="model.scores.difficult" style="margin-top:0.6rem;"></el-rate>
                    </el-form-item>
                    <el-form-item label="操作评分">
                        <!-- 星级评分 -->
                        <el-rate :max="10" show-score v-model="model.scores.skill" style="margin-top:0.6rem;"></el-rate>
                    </el-form-item>
                    <el-form-item label="攻击评分">
                        <!-- 星级评分 -->
                        <el-rate :max="10" show-score v-model="model.scores.attack" style="margin-top:0.6rem;"></el-rate>
                    </el-form-item>
                    <el-form-item label="生存评分">
                        <!-- 星级评分 -->
                        <el-rate :max="10" show-score v-model="model.scores.survive" style="margin-top:0.6rem;"></el-rate>
                    </el-form-item>

                    <el-form-item label="顺风出装">
                        <el-select v-model="model.items1" placeholder="请选择" multiple>
                            <el-option
                            v-for="item in items"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="逆风出装">
                        <el-select v-model="model.items2" placeholder="请选择" multiple>
                            <el-option
                            v-for="item in items"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用技巧">
                        <el-input type="textarea" v-model="model.usageTips"></el-input>
                    </el-form-item>
                    <el-form-item label="对抗技巧">
                        <el-input type="textarea" v-model="model.battleTips"></el-input>
                    </el-form-item>
                    <el-form-item label="团战技巧">
                        <el-input type="textarea" v-model="model.teamTips"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="技能" name="skills">
                    <el-button type="text" @click="model.skills.push({})">+ 添加技能</el-button>
                    <el-row type="flex" style="flex-wrap:wrap">
                        <!-- 12表示宽度占屏幕一半 ,item指具体某个技能，点一下添加技能就push一条数据进去-->
                        <el-col :md="12" v-for="(item,i) in model.skills" :key="i"
                        style="border-bottom:1px solid #333;padding:10px;">  

                            <el-form-item label="技能名称">
                                <el-input v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="技能图标">
                                <!-- 提交图片到  $http.defaults.baseURL+'/upload' -->
                                <el-upload
                                class="avatar-uploader"
                                :action="$http.defaults.baseURL+'/upload'"
                                :headers="getAuthorization()"
                                :show-file-list="false"
                                :on-success="res => $set(item,'icon',res.url)"
                                >
                                <img v-if="item.icon" :src="item.icon" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="技能描述">
                                <el-input type="textarea" v-model="item.description"></el-input>
                            </el-form-item>
                            <el-form-item label="小提示">
                                <el-input type="textarea" v-model="item.tips"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" size="small" @click="model.skills.splice(i,1)">删除</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-form-item>
                        <el-button type="primary" native-type="submit" style="margin-top:30px">保存</el-button>
                    </el-form-item>
            </el-tabs>
            
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            model:{
                name: "",
                avatar: "",
                scores:{},
                skills: [
                    {
                    name:"",
                    icon:"",
                    description:"",
                    tips:""
                    }
                ]
            },
            id: this.$route.params.id,
            // 英雄定位：
            heroPosition: [],
            // 出装选择
            items: []
        }
    },
    created(){
        if(this.id){
            // 如果传入了 id表示进入的是编辑页面，
            // 刚进入的时候就通过 id获取到要编辑的项
            this.getData()
        }
        this.getPosition()  //从分类接口请求英雄定位数据
        this.getItems()  //获取装备列表
},
    methods:{
        afterUpload(res){
            alert("上传成功！")
            // this.$set(this.model,"avatar",res.url)  
            // 等价于
            this.model.avatar = res.url
            // 当一开始model中没有icon属性后来有添加的话通过普通赋值this.model.icon = res.url
            // 可能会赋不上，这种情况下使用this.$set(this.model,"icon",res.url) 比较好
        },
        async save(){
            
            let res
            if(this.id){

            // 传入了id表示修改分类   put请求

            res = this.$http.put("rest/heroes/"+this.id , this.model)
            }else{
             
            // 没有传入id表示新建分类    post请求  
            res = await this.$http.post("rest/heroes",this.model)
            // 提交完成显示成功信息并跳转到  categroies/list 页面
            }
            // EUI提供的方法
            this.$message({
                type:"success",
                message:"保存成功！"
            })

            this.$router.push("/heroes/list")
            
        },
        async getData(){
            // 请求接口数据
            const res = await this.$http.get("rest/heroes/"+this.id)
            // this.model = res.data

            // 此赋值方式可以避免请求的服务端的数据直接覆盖model中原有的数据
            this.model = Object.assign({},this.model,res.data)
        },
        async getPosition(){
            const res = await this.$http.get("rest/categories"); //请求页面数据
             this.heroPosition = res.data; //获取页面数据
        },
        async getItems(){
            const res = await this.$http.get("rest/goods"); //请求装备列表
             this.items = res.data; //获取页面数据
        }
    }
}
</script>


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>