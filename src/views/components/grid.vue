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
            <div v-else>
              {{ scope.row[col.colId] }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <div v-if="operation === 'user'">
              <el-button
                size="mini"
                @click="changeUserClass(scope.$index, scope.row)"
                >修改会员等级</el-button
              >
            </div>
            <div v-else>
              <el-button
                size="mini"
                @click="handleViewOrder(scope.$index, scope.row)"
                >查看订单</el-button
              >
              <el-button
                size="mini"
                @click="handleCloseOrder(scope.$index, scope.row)"
                v-show="scope.row.status === 0"
                >关闭订单</el-button
              >
              <el-button
                size="mini"
                @click="handleDeliveryOrder(scope.$index, scope.row)"
                v-show="scope.row.status === 1"
                >订单发货</el-button
              >
              <el-button
                size="mini"
                @click="handleViewLogistics(scope.$index, scope.row)"
                v-show="scope.row.status === 2 || scope.row.status === 3"
                >订单跟踪</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteOrder(scope.$index, scope.row)"
                v-show="scope.row.status === 4"
                >删除订单</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
      >
        确定
      </el-button>
    </div> -->
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
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
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
    operation: {
      type: null
    },
    checkBox: {
      type: null
    }
  },
  components: { LogisticsDialog },
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

  created() {
    this.rowData.forEach(_it => {
      if (this.columnDefs.find(_el => _el.colId === "receiverDetailAddress")) {
        _it.receiverDetailAddress =
          _it.receiverProvince +
          _it.receiverCity +
          _it.receiverRegion +
          _it.receiverDetailAddress.replace("%%", "");
      }
      if (this.columnDefs.find(_el => _el.colId === "payType")) {
        _it.payType =
          _it.payType === 1 ? "微信" : _it.payType === 2 ? "支付宝" : "未支付";
      }
    });
  },

  methods: {
    headerRowStyle(row) {
      return {};
    },
    handleResetSearch() {
      this.searchParams = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.searchParams.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleViewOrder(index, row) {
      // this.$router.push({ path: "/order/orderDetail", query: { id: row.id } });
      this.$emit("onViewDetailBtnClicked", row.id);
    },
    changeUserClass(index, row) {
      // this.$router.push({ path: "/order/orderDetail", query: { id: row.id } });
      this.$emit("changeUserClass", row.id);
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleDeliveryOrder(index, row) {
      let listItem = this.covertOrder(row);
      this.$emit("onDeliveryBtnClicked", listItem);
    },
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder(index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的订单",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let list = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if (list.length === 0) {
          this.$message({
            message: "选中订单中没有可以发货的订单",
            type: "warning",
            duration: 1000
          });
          return;
        }
        this.$router.push({
          path: "/order/deliverOrderList",
          query: { list: list }
        });
      } else if (this.operateType === 2) {
        //关闭订单
        this.closeOrder.orderIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id);
        }
        this.closeOrder.dialogVisible = true;
      } else if (this.operateType === 3) {
        //删除订单
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
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
    deleteOrder(ids) {
      this.$emit("onDeleteOrderBtnClicked", ids);
      console.log("wocao");
    },
    covertOrder(order) {
      let address =
        order.receiverProvince +
        order.receiverCity +
        order.receiverRegion +
        order.receiverDetailAddress;
      let listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null
      };
      return listItem;
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
</style>
