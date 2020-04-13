<template>
  <div>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="rowData.list"
        header-row-class-name="columnHeader"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column
          v-if="checkBox"
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="col in columnDefs"
          :key="col.colId"
          :width="col.width || ''"
          :label="col.name"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="col.type === 'image'">
              <img
                style="height: 40px; cursor: pointer; margin-top: 5px;"
                :src="scope.row[col.colId]"
                @click="onPreviewClicked(scope.row[col.colId])"
              />
            </div>
            <div v-if="col.type === 'dateTime'">
              {{ scope.row[col.colId] | formatTime }}
            </div>
            <div v-if="col.type !== 'image' && col.type !== 'dateTime'">
              {{ scope.row[col.colId] }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="operations"
          label="操作"
          align="center"
          :width="operations.length * 80 + 'px'"
        >
          <template slot-scope="scope">
            <div style="overflow:hidden;">
              <div
                v-for="item in operations"
                :key="item.eName"
                style="float:left; margin-right: 10px;"
              >
                <div>
                  <el-button
                    size="mini"
                    :type="item.type"
                    v-if="
                      !item.condition ||
                        scope.row[item.condition.colId] === item.condition.value
                    "
                    @click="onOperate(scope.$index, scope.row, item.eName)"
                  >
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="pagination" class="pagination-container">
      <el-pagination
        background
        @size-change="pageSizeChanged"
        @current-change="pageNumberChanged"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="searchParams.pageNum"
        :page-size="rowData.pageSize || 5"
        :page-sizes="[5, 10, 15]"
        :total="rowData.total"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrder.dialogVisible"
      width="30%"
    >
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="imagePreviewVisible"
      top="10px"
      style="text-align:center;"
    >
      <img width="60%" :src="previewImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "grid-component",
  props: {
    columnDefs: {
      type: Array
    },
    rowData: {
      type: null
    },
    pagination: {
      type: null
    },
    operations: {
      type: null
    },
    checkBox: {
      type: null
    }
  },
  data: () => {
    return {
      imagePreviewVisible: false,
      previewImageUrl: "",
      searchParams: {
        pageSize: 5,
        pageNum: 1
      },
      listLoading: false,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      logisticsDialogVisible: false
    };
  },

  watch: {
    rowData: function(newVal) {
      if (newVal) {
        this.formatData();
      }
    }
  },

  created() {
    this.formatData();
  },

  methods: {
    formatData() {
      if (Array.isArray(this.rowData.list)) {
        this.rowData.list.forEach(_it => {
          if (
            this.columnDefs.find(_el => _el.colId === "receiverDetailAddress")
          ) {
            console.log(_it, "wocaonidaye");
            _it.receiverDetailAddress =
              _it.receiverProvince +
              _it.receiverCity +
              _it.receiverRegion +
              _it.receiverDetailAddress.replace("%%", "");
          }
          if (this.columnDefs.find(_el => _el.colId === "payType")) {
            _it.payType =
              _it.payType === 1
                ? "微信"
                : _it.payType === 2
                ? "支付宝"
                : "未支付";
          }
        });
      }
    },

    onOperate(index, row, type) {
      console.log(index, row, type);
      this.$emit("onOperate", { id: row.id, data: row, type: type });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },

    pageSizeChanged(val) {
      this.searchParams.pageNum = 1;
      this.searchParams.pageSize = val;
      this.getList();
    },
    pageNumberChanged(val) {
      this.searchParams.pageNum = val;
      this.getList();
    },
    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === "") {
        this.$message({
          message: "操作备注不能为空",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let params = new URLSearchParams();
      params.append("ids", this.closeOrder.orderIds);
      params.append("note", this.closeOrder.content);
      closeOrder(params).then(response => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getList();
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },

    getList() {
      this.$emit("onPaginationChange", this.searchParams);
    },

    onPreviewClicked(url) {
      if (url) {
        this.imagePreviewVisible = true;
        this.previewImageUrl = url;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.input-width {
  width: 203px;
}
.table-container {
  .el-table {
    .columnHeader {
      .th {
        background: red;
        color: blue;
      }
    }
  }
}
.operation-wrapper {
  div {
    float: left;
    width: 40px;
  }
}
</style>
