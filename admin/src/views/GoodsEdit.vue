<template>
    <div>
        <!-- 根据是否传入id决定页面是新建分类还是编辑分类 -->
        <h1>{{id ? "编辑": "新建"}}分类</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            
            <el-form-item label="装备名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="装备图标">
                <!-- 提交图片到  $http.defaults.baseURL+'/upload' -->
                <!-- getAuthorization()表示获取token，是main中注册的方法 -->
                <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL+'/upload'"
                :headers="getAuthorization()"
                :show-file-list="false"
                :on-success="afterUpload"
                >
                <img v-if="model.icon" :src="model.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            model:{},
            id: this.$route.params.id,
            
        }
    },
    created(){
        if(this.id){
            // 如果传入了 id表示进入的是编辑页面，
            // 刚进入的时候就通过 id获取到要编辑的项
            this.getData()
        }
},
    methods:{
        afterUpload(res){
            alert("上传成功！")
            this.$set(this.model,"icon",res.url)  
            // 等价于this.model.icon = res.url
            // 当一开始model中没有icon属性后来有添加的话通过普通赋值this.model.icon = res.url
            // 可能会赋不上，这种情况下使用this.$set(this.model,"icon",res.url) 比较好
        },
        async save(){
            
            let res
            if(this.id){

            // 传入了id表示修改分类   put请求

            res = this.$http.put("rest/goods/"+this.id , this.model)
            }else{
             
            // 没有传入id表示新建分类    post请求  
            res = await this.$http.post("rest/goods",this.model)
            // 提交完成显示成功信息并跳转到  categroies/list 页面
            }
            // EUI提供的方法
            this.$message({
                type:"success",
                message:"保存成功！"
            })

            this.$router.push("/goods/list")
            
        },
        async getData(){
            // 请求接口数据
            const res = await this.$http.get("rest/goods/"+this.id)
            this.model = res.data
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
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>