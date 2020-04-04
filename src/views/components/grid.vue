<template>
  <div>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="rowData"
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
          sortable
          :label="col.name"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="col.type === 'image'">
              <img style="height: 80px" :src="scope.row[col.colId]" />
            </div>
            <div v-if="col.type === 'dateTime'">
              {{ scope.row[col.colId] | formatTime }}
            </div>
            <div v-else>
              {{ scope.row[col.colId] }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="operations"
          label="操作"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            <div style="overflow:hidden;">
              <div
                v-for="item in operations"
                :key="item"
                style="float:left; margin-right: 10px;"
              >
                <div v-if="item === 'user'">
                  <el-button
                    size="mini"
                    @click="onOperate(scope.$index, scope.row, item)"
                    >修改会员等级</el-button
                  >
                </div>
                <div v-if="item === 'check'">
                  <el-button
                    size="mini"
                    @click="onOperate(scope.$index, scope.row, item)"
                    >查看</el-button
                  >
                </div>
                <div v-if="item === 'edit'">
                  <el-button
                    size="mini"
                    @click="onOperate(scope.$index, scope.row, item)"
                    >编辑</el-button
                  >
                </div>
                <div v-if="item === 'close'">
                  <el-button
                    size="mini"
                    @click="onOperate(scope.$index, scope.row, item)"
                    v-show="scope.row.status === 0"
                    >关闭</el-button
                  >
                </div>
                <div v-if="item === 'delivery'">
                  <el-button
                    size="mini"
                    @click="onOperate(scope.$index, scope.row, item)"
                    v-show="scope.row.status === 1"
                    >发货</el-button
                  >
                </div>
                <div v-if="item === 'follow'">
                  <el-button
                    size="mini"
                    @click="onOperate(scope.$index, scope.row, item)"
                    v-show="scope.row.status === 2 || scope.row.status === 3"
                    >跟踪</el-button
                  >
                </div>
                <div v-if="item === 'delete'">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="onOperate(scope.$index, scope.row, item)"
                    >删除</el-button
                  >
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="searchParams.pageNum"
        :page-size="searchParams.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="total"
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
      type: Array
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
      logisticsDialogVisible: false,
      statusOptions: [
        {
          label: "待付款",
          value: 0
        },
        {
          label: "待发货",
          value: 1
        },
        {
          label: "已发货",
          value: 2
        },
        {
          label: "已完成",
          value: 3
        },
        {
          label: "已关闭",
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: "正常订单",
          value: 0
        },
        {
          label: "秒杀订单",
          value: 1
        }
      ],
      sourceTypeOptions: [
        {
          label: "PC订单",
          value: 0
        },
        {
          label: "APP订单",
          value: 1
        }
      ],
      operateOptions: [
        {
          label: "批量发货",
          value: 1
        },
        {
          label: "关闭订单",
          value: 2
        },
        {
          label: "删除订单",
          value: 3
        }
      ]
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
      this.rowData.forEach(_it => {
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

    handleSizeChange(val) {
      this.searchParams.pageNum = 1;
      this.searchParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
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
      this.$emit("refreshList", this.searchParams);
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
