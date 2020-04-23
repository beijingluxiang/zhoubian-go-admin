<template>
  <div class="detail-container">
    <!-- <div>
      <el-steps
        :active="formatStepStatus(order.status)"
        finish-status="success"
        align-center
      >
        <el-step
          title="提交订单"
          :description="formatTime(order.createTime)"
        ></el-step>
        <el-step
          title="支付订单"
          :description="formatTime(order.paymentTime)"
        ></el-step>
        <el-step
          title="平台发货"
          :description="formatTime(order.deliveryTime)"
        ></el-step>
        <el-step
          title="确认收货"
          :description="formatTime(order.receiveTime)"
        ></el-step>
      </el-steps>
    </div> -->
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{ order.statusDesc }} </span>
        <span class="color-danger" style="margin-left: 20px;">
          {{ order.remainPayTimeDesc }}</span
        >
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
        <span class="font-small">收货人信息</span>
      </div>

      <gridComponent
        :columnDefs="deliveryColDefs"
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
        合计：<span style="margin-right: 10px;" class="color-danger"
          >￥{{ order.totalAmount }}</span
        >
        配送费用：<span class="color-danger" style="margin-right: 10px;"
          >+￥{{ order.freightAmount }}</span
        >
        满减：<span class="color-danger">-￥{{ order.promotionAmount }}</span>
      </div>
      <div v-if="order.status === 0" style="float: right;margin: 20px">
        <el-button size="mini" type="danger" @click="closeOrder(order.id)">
          取消订单
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getOrderDetail, closeOrder } from "@/api/order-zy";
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
          this.orderList = {
            list: [response.data]
          };
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
          name: "订单",
          colId: "orderSn"
        },
        {
          name: "订单类型",
          colId: "orderTypeDesc"
        },
        {
          name: "订单金额",
          colId: "payAmount"
        },
        {
          name: "下单时间",
          colId: "createTime",
          type: "dateTime"
        },
        {
          name: "桌台名称",
          colId: "tableName"
        },
        {
          name: "订单状态",
          colId: "statusDesc"
        }
      ],
      deliveryColDefs: [
        {
          name: "收货人",
          colId: "receiverName"
        },
        {
          name: "手机号码",
          colId: "receiverPhone"
        },
        {
          name: "收货地址",
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
      this.orderList = {
        list: [response.data]
      };
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
    closeOrder(id) {
      this.$confirm("是否取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        closeOrder([id]).then(res => {
          if (res) {
            this.$message("操作成功");
            this.$emit("operationSuccess");
          }
        });
      });
    }
  }
};
</script>
<style scoped>
.detail-container {
  width: 100%;
  padding: 0px 20px 20px 20px;
  margin: 20px auto;
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
