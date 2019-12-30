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
      :operation="{}"
      :checkBox="true"
      :pagination="true"
      @onDeleteOrderBtnClicked="deleteOrder"
      @onViewDetailBtnClicked="viewDetail"
      @onDeliveryBtnClicked="deliveryOrder"
      @refreshList="refreshList"
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
import { fetchList, deleteOrder } from "@/api/order";
import { exportOrder } from "@/api/order-zy";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/order/order/order-detail.vue";
import deliveryComponent from "@/views/order/order/deliver-order.vue";
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
          name: "商品名称",
          colId: "productName"
        },
        {
          name: "规格",
          colId: "productSize"
        },
        {
          name: "实付款",
          colId: "totalAmount"
        },
        {
          name: "订单状态",
          colId: "status"
        },
        {
          name: "创建时间",
          colId: "createTime"
        },
        {
          name: "用户",
          colId: "user"
        },
        {
          name: "收件人",
          colId: "receiverName"
        }
      ],
      searchFieldsList: [
        {
          name: "下单时间",
          eName: "createdTime",
          type: "dateTimeRange",
          placeholder: "请选择时间"
        },
        {
          name: "订单编号",
          eName: "orderSn",
          type: "text",
          placeholder: "请选择时间"
        },
        {
          name: "商品名称",
          eName: "productName",
          type: "text",
          placeholder: "请输入订单编号"
        },
        {
          name: "收货人",
          eName: "receiverName",
          type: "text",
          placeholder: "请输入收货人"
        },
        {
          name: "用户",
          eName: "user",
          type: "text",
          placeholder: "请输入用户"
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
            { label: "已关闭", value: 4 }
          ],
          placeholder: "请输入用户"
        }
      ],
      searchOperation: ["search", "reset", "export"]
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
      fetchList(this.searchParams).then(response => {
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
