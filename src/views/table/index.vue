<template>
  <div class="app-container">
    <searchComponent
      :searchFieldsList="searchFieldsList"
      :operation="searchOperation"
      @onSearchBtnClicked="searchList"
    ></searchComponent>
    <el-button
      style="margin-top: 20px;"
      type="primary"
      class="btn-add"
      @click="handleAddTable()"
      size="mini"
    >
      添加桌台
    </el-button>
    <gridComponent
      :columnDefs="orderListColDefs"
      :rowData="orderList"
      :operations="operations"
      :checkBox="true"
      :pagination="true"
      @onPaginationChange="onPaginationChange"
      @onOperate="onGridOperate"
    ></gridComponent>

    <el-dialog
      title="添加桌台"
      :visible.sync="addTableShow"
      width="50%"
      top="10px"
    >
      <div
        class="viewSettingWrapper"
        style="width: 100%; overflow:hidden; padding: 20px 0;"
      >
        <div style="width: 90%; margin: 0 auto;">
          <form-creater
            :formSchema="formSchema"
            :formDataProp="formData"
            :formBtn="formBtn"
            @formSubmit="submitNow"
          ></form-creater>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTableList,
  deleteTable,
  updateTable,
  createTable
} from "@/api/table";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/order/order-detail.vue";
import deliveryComponent from "@/views/order/deliver-order.vue";
import formCreater from "@/views/components/formCreater.vue";
export default {
  name: "orderList",
  components: {
    searchComponent,
    formCreater,
    gridComponent,
    orderDetailComponent,
    deliveryComponent
  },
  data() {
    return {
      operations: [
        { name: "编辑", eName: "edit", type: "mormal" },
        { name: "删除", eName: "delete", type: "primary" }
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
          name: "名称",
          colId: "name"
        },
        {
          name: "状态",
          colId: "status"
        },
        {
          name: "二维码",
          type: "image",
          colId: "qrcodeUrl"
        },
        {
          name: "创建时间",
          type: "dateTime",
          colId: "createTime"
        }
      ],
      searchFieldsList: [
        {
          name: "桌台名称",
          eName: "tableName",
          type: "text",
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
          name: "状态",
          eName: "status",
          type: "select",
          options: [
            { label: "禁用", value: 0 },
            { label: "正常", value: 1 }
          ],
          placeholder: "桌台的状态"
        }
      ],
      searchOperation: ["search", "reset"],
      formBtn: [{ name: "保存", eName: "save", width: "200px" }],
      formData: null,
      formSchema: [
        {
          name: "桌台名称",
          eName: "name",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "状态",
          eName: "status",
          active: 1,
          inactive: 0,
          type: "switch",
          rules: [{ required: true, trigger: "blur" }]
        }
      ]
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
        case "edit": {
          this.formData = _data;
          this.addTableShow = true;
          break;
        }
        case "delete": {
          this.$confirm("是否要进行删除操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            deleteTable(_id).then(res => {
              this.getList();
            });
          });
          break;
        }
      }
      console.log(params);
    },

    submitNow(params) {
      createTable(params.data)
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
      getTableList(this.searchParams).then(response => {
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
