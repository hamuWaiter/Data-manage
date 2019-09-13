<template>
    <div>
        <!-- 根据是否传入id决定页面是新建分类还是编辑分类 -->
        <h1>{{id ? "编辑": "新建"}}分类</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            
            <el-form-item label="父级分类">
                <el-select v-model="model.parent" placeholder="请选择">
                <el-option
                v-for="item in parents"
                :key="item._id"
                :label="item.name"
                :value="item._id">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
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
            parents:[]
        }
    },
    created(){
        if(this.id){
            // 如果传入了 id表示进入的是编辑页面，
            // 刚进入的时候就通过 id获取到要编辑的项
            this.getData()
        }
        this.getParents()
},
    methods:{
        async save(){
            
            let res
            if(this.id){

            // 传入了id表示修改分类   put请求

            res = this.$http.put("rest/categories/"+this.id , this.model)
            }else{
             
            // 没有传入id表示新建分类    post请求  
            res = await this.$http.post("rest/categories",this.model)
            // 提交完成显示成功信息并跳转到  categroies/list 页面
            }
            // EUI提供的方法
            this.$message({
                type:"success",
                message:"保存成功！"
            })

            this.$router.push("/categroies/list")
            
        },
        async getData(){
            // 请求接口数据
            const res = await this.$http.get("rest/categories/"+this.id)
            this.model = res.data
        },
        async getParents(){
            const res = await this.$http.get("rest/categories")
            this.parents = res.data
            console.log(this.parents)
        }
    }
}
</script>
