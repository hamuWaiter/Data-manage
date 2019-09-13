<template>
  <div>
    <h1>文章列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="260"></el-table-column>
      <el-table-column prop="title" label="分类名称" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="$router.push('/articles/edit/'+scope.row._id)"
            type="primary"
            size="small"
          >编辑</el-button>
          <!-- scope.row表示整个一行的数据 -->
          <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$http.get("rest/articles"); //请求页面数据
      this.items = res.data; //获取页面数据
    },
    async remove(row) {
      this.$confirm("是否确认删除分类"+row.title+"?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete("rest/articles/" + row._id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        // 删除成功重新获取一下数据
        this.getData();
      });
    }
  }
};
</script>

<style lang="">
</style>