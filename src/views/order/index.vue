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
      @onPaginationChange="onPaginationChange"
      @onOperate="onOperate"
    ></gridComponent>

    <el-dialog
      title="商品详情"
      :visible.sync="productDetailVisible"
      width="80%"
      top="10px"
    >
      <orderDetailComponent
        destroy-on-close="true"
        :productId="detailId"
      ></orderDetailComponent>
    </el-dialog>

    <el-dialog title="物流信息" :visible.sync="deliveryVisible" width="80%">
      <deliveryComponent
        :deliveryInfo="deliveryParams"
        @deliverySuccessfully="deliverySuccessfully"
      ></deliveryComponent>
    </el-dialog>
  </div>
</template>
<script>
import { exportOrder, getOrderList, deleteOrder } from "@/api/order-zy";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/order/order-detail.vue";
import deliveryComponent from "@/views/order/deliver-order.vue";
export default {
  name: "orderList",
  components: {
    searchComponent,
    gridComponent,
    orderDetailComponent,
    deliveryComponent
  },
  data() {
    return {
      operations: [
        { name: "查看", eName: "check", type: "mormal" },
        { name: "删除", eName: "delete", type: "primary" }
      ],
      orderList: [],
      deliveryParams: null,
      searchParams: {},
      productDetailVisible: false,
      deliveryVisible: false,
      detailId: null,
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
          type: "dateTime",
          colId: "createTime"
        },
        {
          name: "桌台名称",
          colId: "tableName"
        },
        {
          name: "订单状态",
          colId: "statusDesc"
        },
        {
          name: "收货人",
          colId: "receiverName"
        },
        {
          name: "收货人手机号",
          colId: "receiverPhone"
        },
        {
          name: "配送地址",
          colId: "receiverDetailAddress",
          width: "200px"
        }
      ],
      searchFieldsList: [
        {
          name: "订单编号",
          eName: "orderSn",
          type: "text",
          placeholder: "订单编号"
        },
        {
          name: "桌台名称",
          eName: "tableName",
          type: "select",
          options: [
            { label: "桌台1", value: 0 },
            { label: "桌台2", value: 1 },
            { label: "桌台3", value: 2 },
            { label: "桌台4", value: 3 },
            { label: "桌台5", value: 4 }
          ],
          placeholder: "请选择桌台名称"
        },
        {
          name: "订单状态",
          eName: "status",
          type: "select",
          options: [
            { label: "待付款", value: 0 },
            { label: "待发货", value: 1 },
            { label: "已发货", value: 2 },
            { label: "已完成", value: 3 },
            { label: "已关闭", value: 4 },
            { label: "退款中", value: 11 },
            { label: "退款完成", value: 12 },
            { label: "退款拒绝", value: 13 }
          ],
          placeholder: "订单状态"
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
          placeholder: "订单类型"
        },
        {
          name: "收货人信息",
          eName: "receiverKeyword",
          type: "text",
          placeholder: "姓名/手机号"
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
        case "delete": {
          this.deleteOrder([_id]);
          break;
        }
      }
    },
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
      getOrderList(this.searchParams).then(response => {
        const _data = response.data;
        this.listLoading = false;
        this.orderList = {
          list: _data.list,
          totalPage: _data.totalPage,
          total: _data.total
        };
      });
    },

    onPaginationChange(params) {
      this.searchParams["pageSize"] = params.pageSize;
      this.searchParams["pageNum"] = params.pageNum;
      this.getList();
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
    viewDetail(id) {
      this.detailId = id;
      this.productDetailVisible = true;
      console.log("worinima", id);
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
