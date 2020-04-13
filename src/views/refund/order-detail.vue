<template>
  <div class="detail-container">
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{ order.statusDesc }}</span>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>

      <gridComponent
        :columnDefs="orderListColDefs"
        :rowData="orderList"
        :pagination="null"
        :checkBox="null"
        :operation="null"
      ></gridComponent>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.orderItemList"
        style="width: 100%;margin-top: 20px"
        border
      >
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productPic" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productName }}</p>
            <p>品牌：{{ scope.row.productBrand }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{ scope.row.productPrice }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.productQuantity }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.productPrice * scope.row.productQuantity }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: left;margin: 20px">
        合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
      </div>
      <div style="float: right;margin: 20px">
        <el-button size="mini" @click="refund(order.id, 1)">
          同意退款
        </el-button>
        <el-button size="mini" type="danger" @click="refund(order.id, 0)">
          拒绝退款
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getOrderDetail, refundMoney } from "@/api/order-zy";
import { formatDate } from "@/utils/date";
import VDistpicker from "v-distpicker";
const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null
};
import gridComponent from "@/views/components/grid";
export default {
  name: "orderDetail",
  components: { VDistpicker, gridComponent },
  props: {
    productId: {
      type: Number
    }
  },

  watch: {
    productId: function(newVal, oldVal) {
      if (newVal) {
        getOrderDetail(newVal).then(response => {
          this.order = response.data;
          this.orderList = [response.data];
        });
      }
    }
  },

  data() {
    return {
      id: null,
      order: {},
      receiverDialogVisible: false,
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyDialogVisible: false,
      orderList: [],
      orderListColDefs: [
        {
          name: "退单编号",
          colId: "refundId"
        },
        {
          name: "订单编号",
          colId: "orderSn"
        },
        {
          name: "退款状态",
          colId: "status"
        },
        {
          name: "订单类型",
          colId: "orderTypeDesc"
        },
        {
          name: "退款金额",
          colId: "refundAmount"
        },
        {
          name: "退款时间",
          type: "dateTime",
          colId: "refundFinishTime"
        },
        {
          name: "订单状态",
          colId: "statusDesc"
        },
        {
          name: "配送手机号",
          colId: "receiverPhone"
        },
        {
          name: "配送地址",
          colId: "receiverDetailAddress"
        }
      ],
      moneyInfo: {
        orderId: null,
        freightAmount: 0,
        discountAmount: 0,
        status: null
      },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      logisticsDialogVisible: false
    };
  },

  created() {
    // this.id = this.list = this.$route.query.id;
    console.log(this.productId);
    getOrderDetail(this.productId).then(response => {
      this.order = response.data;
      this.orderList = [response.data];
    });
  },

  filters: {
    formatStatus(value) {
      if (value === 1) {
        return "待发货";
      } else if (value === 2) {
        return "已发货";
      } else if (value === 3) {
        return "已完成";
      } else if (value === 4) {
        return "已关闭";
      } else if (value === 5) {
        return "无效订单";
      } else {
        return "待付款";
      }
    }
  },
  methods: {
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStepStatus(value) {
      if (value === 1) {
        //待发货
        return 2;
      } else if (value === 2) {
        //已发货
        return 3;
      } else if (value === 3) {
        //已完成
        return 4;
      } else {
        //待付款、已关闭、无限订单
        return 1;
      }
    },
    refund(id, type) {
      refundMoney(id, type)
        .then(res => {
          this.$message("操作成功");
          this.$emit("refundProcessed");
        })
        .catch(err => {
          this.$message("操作失败");
        });
    }
  }
};
</script>
<style scoped>
.el-dialog__body {
  padding-top: 0;
}

.detail-container {
  width: 100%;
  padding: 0px 20px 20px 20px;
}

.operate-container {
  background: #f2f6fc;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
