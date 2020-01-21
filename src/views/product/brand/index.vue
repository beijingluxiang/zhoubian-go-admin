<template>
  <div class="app-container" style="padding-bottom: 50px;">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>供应商列表</span>
      <el-button class="btn-add" @click="addBrand()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="brandTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="供应商名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="dialogVisibleAdd"
      top="10px"
      @closed="dialogClosed"
    >
      <div style="height: 300px;">
        <addComponent></addComponent>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleUpdate"
      top="10px"
      @closed="dialogClosed"
    >
      <div style="height: 300px;">
        <addComponent :editingData="editingData"></addComponent>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { createBrand, getBrand, editBrand, deleteBrand } from "@/api/brand-zy";
import addComponent from "@/views/product/brand/add";
import updateComponent from "@/views/product/brand/update";

export default {
  name: "brandList",
  components: { addComponent, updateComponent },
  data() {
    return {
      editingData: "",
      dialogVisibleAdd: false,
      dialogVisibleUpdate: false,
      operates: [
        {
          label: "显示品牌",
          value: "showBrand"
        },
        {
          label: "隐藏品牌",
          value: "hideBrand"
        }
      ],
      operateType: null,
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10
      },
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    dialogClosed() {
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getBrand().then(response => {
        this.listLoading = false;
        this.list = response.data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleUpdate(index, row) {
      this.editingData = row;
      this.dialogVisibleUpdate = true;
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteBrand(row.id).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    getProductList(index, row) {
      console.log(index, row);
    },
    getProductCommentList(index, row) {
      console.log(index, row);
    },
    handleFactoryStatusChange(index, row) {
      var data = new URLSearchParams();
      data.append("ids", row.id);
      data.append("factoryStatus", row.factoryStatus);
      updateFactoryStatus(data)
        .then(response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(error => {
          if (row.factoryStatus === 0) {
            row.factoryStatus = 1;
          } else {
            row.factoryStatus = 0;
          }
        });
    },
    handleShowStatusChange(index, row) {
      let data = new URLSearchParams();
      data.append("ids", row.id);
      data.append("showStatus", row.showStatus);
      updateShowStatus(data)
        .then(response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(error => {
          if (row.showStatus === 0) {
            row.showStatus = 1;
          } else {
            row.showStatus = 0;
          }
        });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    searchBrandList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleBatchOperate() {
      console.log(this.multipleSelection);
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let showStatus = 0;
      if (this.operateType === "showBrand") {
        showStatus = 1;
      } else if (this.operateType === "hideBrand") {
        showStatus = 0;
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      let data = new URLSearchParams();
      data.append("ids", ids);
      data.append("showStatus", showStatus);
      updateShowStatus(data).then(response => {
        this.getList();
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    addBrand() {
      this.dialogVisibleAdd = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
