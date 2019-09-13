<template>
    <div>
        <!-- 根据是否传入id决定页面是新建分类还是编辑分类 -->
        <h1>{{id ? "编辑": "新建"}}文章</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            
            <el-form-item label="所属分类">
                <el-select v-model="model.categories" placeholder="请选择" multiple>
                <el-option
                v-for="item in allCategory"
                :key="item._id"
                :label="item.name"
                :value="item._id">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="model.title"></el-input>
            </el-form-item>
            <el-form-item label="文章详情">
                <!-- 自定义图片上传而不是将图片以base64格式存放到文本中那样太大  -->
                <vue-editor v-model="model.body" 
                useCustomImageHandler 
                @image-added="handleImageAdded"
                ></vue-editor>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
export default {
    data(){
        return {
            model:{},
            id: this.$route.params.id,
            allCategory:[]
        }
    },
    created(){
        if(this.id){
            // 如果传入了 id表示进入的是编辑页面，
            // 刚进入的时候就通过 id获取到要编辑的项
            this.getData()
        }
        this.getCategory()
    },
    methods:{
        async save(){
            
            let res
            if(this.id){

            // 传入了id表示修改分类   put请求

            res = this.$http.put("rest/articles/"+this.id , this.model)
            }else{
             
            // 没有传入id表示新建分类    post请求  
            res = await this.$http.post("rest/articles",this.model)
            // 提交完成显示成功信息并跳转到  categroies/list 页面
            }
            // EUI提供的方法
            this.$message({
                type:"success",
                message:"保存成功！"
            })

            this.$router.push("/articles/list")
            
        },
        async getData(){
            // 请求接口数据
            const res = await this.$http.get("rest/articles/"+this.id)
            this.model = res.data
        },
        async getCategory(){
            const res = await this.$http.get("rest/categories")
            this.allCategory = res.data
        },
        async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)
 
      var formData = new FormData();
      formData.append("file", file);
    
    //   const res = await this.$http.post(this.$http.defaults.baseURL+'/upload',formData)
      const res = await this.$http.post(this.$http.defaults.baseURL+'/upload',formData)
      
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();      
    }
    },
    components: {
    VueEditor
    }
}
</script>
