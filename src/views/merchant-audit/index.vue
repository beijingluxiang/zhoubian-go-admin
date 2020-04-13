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
      :operations="operations"
      :checkBox="true"
      :pagination="true"
      @onPaginationChange="onPaginationChange"
      @onOperate="onGridOperate"
    ></gridComponent>
  </div>
</template>
<script>
import {
  getRegisterList,
  agreeRegister,
  rejectRegister
} from "@/api/maintenance";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/register/detail.vue";
export default {
  name: "orderList",
  components: {
    searchComponent,
    gridComponent,
    orderDetailComponent
  },
  data() {
    return {
      operations: [
        {
          name: "同意",
          eName: "agree",
          type: "mormal",
          condition: { colId: "status", value: 0 }
        },
        {
          name: "拒绝",
          eName: "reject",
          type: "primary",
          condition: { colId: "status", value: 0 }
        }
      ],
      addTableShow: false,
      orderList: [],
      deliveryParams: null,
      searchParams: {},
      productDetailVisible: false,
      deliveryVisible: false,
      detailId: null,
      orderListColDefs: [
        {
          name: "序号",
          colId: "id"
        },
        {
          name: "商户名称",
          colId: "name"
        },
        {
          name: "所属地区",
          colId: "address"
        },
        {
          name: "商户地址",
          colId: "addressDetail"
        },
        {
          name: "所属行业",
          colId: "category"
        },
        {
          name: "联系人",
          colId: "contactPerson"
        },
        {
          name: "联系电话",
          colId: "conatact"
        },
        {
          name: "商户号",
          colId: "shopNumber"
        },
        {
          name: "状态",
          colId: "statusDesc"
        }
      ],
      searchFieldsList: [
        {
          name: "商户名称",
          eName: "name",
          type: "text",
          placeholder: "商户名称"
        },
        {
          name: "联系电话",
          eName: "contact",
          type: "text",
          placeholder: "商户名称"
        },
        {
          name: "状态",
          eName: "status",
          type: "select",
          options: [
            { label: "待审核", value: 0 },
            { label: "已拒绝", value: -1 },
            { label: "审核通过", value: 1 }
          ],
          placeholder: "商户审核状态"
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
    onGridOperate(params) {
      const _id = params.id;
      const _type = params.type;
      const _data = params.data;
      switch (_type) {
        case "agree": {
          this.$confirm("是否同意商家申请?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            agreeRegister(_id).then(res => {
              this.$message("操作成功");
              this.getList();
            });
          });
          break;
        }
        case "reject": {
          this.$confirm("是否拒绝商家申请?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            rejectRegister(_id).then(res => {
              this.$message("操作成功");
              this.getList();
            });
          });
          break;
        }
      }
      console.log(params);
    },

    submitNow(params) {
      createTable(params)
        .then(res => {
          this.addTableShow = false;
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    searchList(params) {
      console.log(params, "worinima");
      this.searchParams = params;
      this.orderList = [];
      this.getList();
    },

    getList() {
      this.listLoading = true;
      getRegisterList(this.searchParams).then(response => {
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

    handleAddTable() {
      this.addTableShow = true;
    }
  }
};
</script>
<style scoped type="scss"></style>
