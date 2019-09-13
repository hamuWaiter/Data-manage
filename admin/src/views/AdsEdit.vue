<template>
    <div>
        <!-- 根据是否传入id决定页面是新建分类还是编辑分类 -->
        <h1>{{id ? "编辑": "新建"}}广告位</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            
            <el-form-item label="广告位名称">
                 <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="广告">
                <el-button type="text" @click="model.items.push({})">+ 添加广告</el-button>
                <el-row type="flex" style="flex-wrap:wrap">
                    <!-- 12表示宽度占屏幕一半 ,item指具体某个技能，点一下添加技能就push一条数据进去-->
                    <el-col :md="24" v-for="(item,i) in model.items" :key="i"
                    style="border-bottom:1px solid #333;padding:10px;">  

                        <el-form-item label="URL">
                            <el-input v-model="item.url"></el-input>
                        </el-form-item>
                        <el-form-item label="广告图" style="margin-top:20px;">
                            <!-- 提交图片到  $http.defaults.baseURL+'/upload' -->
                            <el-upload
                            class="avatar-uploader"
                            :action="$http.defaults.baseURL+'/upload'"
                            :headers="getAuthorization()"
                            :show-file-list="false"
                            :on-success="res => $set(item,'image',res.url)"
                            >
                            <img v-if="item.image" :src="item.image" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" size="small" @click="model.items.splice(i,1)">删除</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
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
            model:{
                name:"",
                items: []
            },
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
        async save(){
            
            let res
            if(this.id){

            // 传入了id表示修改分类   put请求

            res = this.$http.put("rest/ads/"+this.id , this.model)
            }else{
             
            // 没有传入id表示新建分类    post请求  
            res = await this.$http.post("rest/ads",this.model)
            // 提交完成显示成功信息并跳转到  categroies/list 页面
            }
            // EUI提供的方法
            this.$message({
                type:"success",
                message:"保存成功！"
            })

            this.$router.push("/ads/list")
            
        },
        async getData(){
            // 请求接口数据
            const res = await this.$http.get("rest/ads/"+this.id)
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
    font-size: 18px;
    color: #8c939d;
    /* min-width: 5rem; */
    height: 5rem;
    line-height: 5rem;
    text-align: center;
  }
  .avatar {
    /* min-width: 5rem; */
    height: 5rem;
    display: block;
  }
</style>