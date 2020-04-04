<template>
  <div class="app-container">
    <searchComponent
      :searchFieldsList="searchFieldsList"
      :operation="searchOperation"
      @onSearchBtnClicked="searchList"
    ></searchComponent>

    <gridComponent
      :columnDefs="orderListColDefs"
      :rowData="orderList"
      :operation="'user'"
      :checkBox="true"
      :pagination="true"
      @refreshList="refreshList"
      @changeUserClass="changeUserClass"
    ></gridComponent>

    <el-dialog title="修改用户等级" :visible.sync="userVisible" width="60%">
      <div style="text-align: center;">
        <el-select v-model="newUserClass" placeholder="请选择用户等级">
          <el-option
            v-for="item in searchFieldsList[2].options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="onChangeClass('brandFrom')"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, setUserClass } from "@/api/user-zy";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
export default {
  name: "orderList",
  components: {
    searchComponent,
    gridComponent
  },
  data() {
    return {
      orderList: [],
      deliveryParams: null,
      userVisible: false,
      currentRowId: null,
      searchParams: {},
      newUserClass: null,
      productDetailVisible: false,
      deliveryVisible: false,
      detailId: null,
      orderListColDefs: [
        {
          name: "用户名",
          colId: "name"
        },
        {
          name: "可提取金额",
          colId: "withdrable"
        },
        {
          name: "用户等级",
          colId: "userClassTitle"
        },
        {
          name: "电话",
          colId: "phoneNumber"
        },
        {
          name: "头像",
          colId: "avatar",
          type: "image"
        },
        {
          name: "创建时间",
          colId: "createDateTime"
        }
      ],
      searchFieldsList: [
        {
          name: "用户名称",
          eName: "userName",
          type: "text",
          placeholder: "请输入用户名称"
        },
        {
          name: "用户手机号",
          eName: "phoneNumber",
          type: "text",
          placeholder: "请输入用户手机号"
        },
        {
          name: "会员等级",
          eName: "userClass",
          type: "select",
          options: [
            { label: "普通用户", value: 0 },
            { label: "会员", value: 1 },
            { label: "合伙人", value: 2 },
            { label: "联合创始人", value: 3 }
          ],
          placeholder: "请输入会员等级"
        }
      ],
      searchOperation: ["search"]
    };
  },
  created() {
    this.getList(null);
  },
  filters: {},
  methods: {
    changeUserClass(data) {
      this.currentRowId = data;
      this.userVisible = true;
      console.log(data, "currentdi");
    },
    onChangeClass() {
      console.log(this.newUserClass, "this.newUserClass");
      setUserClass(this.currentRowId, this.newUserClass).then(res => {
        this.$message("修改成功");
        this.userVisible = false;
        this.orderList = [];
        this.getList();
      });
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
      getUserList(this.searchParams).then(response => {
        this.listLoading = false;
        this.orderList = response.data.list;
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
