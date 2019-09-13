<template>
    <div>
        <!-- 根据是否传入id决定页面是新建分类还是编辑分类 -->
        <h1>{{id ? "编辑": "新建"}}管理员</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-form-item label="用户名">
                <el-input v-model="model.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="model.password"></el-input>
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
        async save(){
            
            let res
            if(this.id){

            // 传入了id表示修改分类   put请求

            res = this.$http.put("rest/users/"+this.id , this.model)
            }else{
             
            // 没有传入id表示新建分类    post请求  
            res = await this.$http.post("rest/users",this.model)
            // 提交完成显示成功信息并跳转到  categroies/list 页面
            }
            // EUI提供的方法
            this.$message({
                type:"success",
                message:"保存成功！"
            })

            this.$router.push("/users/list")
            
        },
        async getData(){
            // 请求接口数据
            const res = await this.$http.get("rest/users/"+this.id)
            this.model = res.data
        }
    }
}
</script>
