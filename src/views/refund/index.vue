<template>
  <div class="app-container">
    <searchComponent
      :searchFieldsList="searchFieldsList"
      :operation="searchOperation"
      @onSearchBtnClicked="searchList"
      @onExportOrder="onExportOrder"
    ></searchComponent>

    <gridComponent
      :columnDefs="orderListColDefs"
      :rowData="orderList"
      :operations="operations"
      :checkBox="true"
      :pagination="true"
      @onOperate="onOperate"
    ></gridComponent>

    <el-dialog
      title="退款详情"
      :visible.sync="productDetailVisible"
      width="80%"
      top="10px"
    >
      <orderDetailComponent
        destroy-on-close="true"
        :productId="detailId"
      ></orderDetailComponent>
    </el-dialog>
  </div>
</template>
<script>
import { exportOrder, getRefundList, deleteOrder } from "@/api/order-zy";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/refund/order-detail.vue";
export default {
  name: "orderList",
  components: {
    searchComponent,
    gridComponent,
    orderDetailComponent
  },
  data() {
    return {
      operations: ["check"],
      orderList: [],
      deliveryParams: null,
      searchParams: {},
      productDetailVisible: false,
      deliveryVisible: false,
      detailId: null,
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
          colId: "refundStatusDesc"
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
      searchFieldsList: [
        {
          name: "退单编号",
          eName: "orderSn",
          type: "text",
          placeholder: "请选择时间"
        },
        {
          name: "订单编号",
          eName: "refundId",
          type: "text",
          placeholder: "请选择时间"
        },
        {
          name: "退款状态",
          eName: "status",
          type: "select",
          options: [
            { label: "退款中", value: 11 },
            { label: "退款完成", value: 12 },
            { label: "退款拒绝", value: 13 }
          ],
          placeholder: "请输入用户"
        },
        {
          name: "订单类型",
          eName: "orderType",
          type: "select",
          options: [
            { label: "配送", value: 0 },
            { label: "自提", value: 1 },
            { label: "堂食", value: 2 }
          ],
          placeholder: "请输入用户"
        },
        {
          name: "退款时间",
          eName: "refundIdTime",
          type: "dateTimeRange",
          placeholder: "退款时间"
        }
      ],
      searchOperation: ["search", "reset"]
    };
  },
  created() {
    this.getList(null);
  },
  filters: {},
  methods: {
    deliverySuccessfully() {
      this.deliveryVisible = false;
      this.getList();
    },
    searchList(params) {
      console.log(params, "worinima");
      this.searchParams = params;
      this.orderList = [];
      this.getList();
    },
    refreshList(param) {
      for (let key in param) {
        this.searchParams[key] = param[key];
      }
      this.orderList = [];
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getRefundList(this.searchParams).then(response => {
        this.listLoading = false;
        this.orderList = response.data.list;
      });
    },

    s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    },
    onExportOrder() {
      exportOrder(this.searchParams)
        .then(res => {
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          });
          var fileURL = window.URL.createObjectURL(blob);
          var fileLink = document.createElement("a");

          fileLink.href = fileURL;
          fileLink.setAttribute("download", "file.xlsx");
          document.body.appendChild(fileLink);

          fileLink.click();
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteOrder(ids) {
      console.log("worinima");
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteOrder(params).then(response => {
          this.$message({
            message: "删除成功！",
            type: "success",
            duration: 1000
          });
          this.orderList = [];
          this.getList();
        });
      });
    },
    onOperate(params) {
      const _id = params.id;
      const _type = params.type;
      const _data = params.data;
      switch (_type) {
        case "check": {
          this.detailId = _id;
          this.productDetailVisible = true;
          break;
        }
      }
    },
    deliveryOrder(params) {
      this.deliveryParams = [params];
      this.deliveryVisible = true;
      console.log("wocao", params);
    }
    // covertOrder(order) {
    //   let address =
    //     order.receiverProvince +
    //     order.receiverCity +
    //     order.receiverRegion +
    //     order.receiverDetailAddress;
    //   let listItem = {
    //     orderId: order.id,
    //     orderSn: order.orderSn,
    //     receiverName: order.receiverName,
    //     receiverPhone: order.receiverPhone,
    //     receiverPostCode: order.receiverPostCode,
    //     address: address,
    //     deliveryCompany: null,
    //     deliverySn: null
    //   };
    //   return listItem;
    // }
  }
};
</script>
<style scoped type="scss"></style>
