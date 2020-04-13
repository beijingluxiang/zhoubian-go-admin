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
      添加账号
    </el-button>
    <gridComponent
      :columnDefs="orderListColDefs"
      :rowData="orderList"
      :operations="operations"
      :checkBox="true"
      :pagination="true"
      @refreshList
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
        style="background: #f0f0f0; width: 100%; overflow:hidden; padding: 20px 0;"
      >
        <div style="width: 90%; margin: 0 auto;">
          <form-creater
            :formSchema="formSchema"
            :formDataProp="formData"
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
      operations: ["edit", "disable"],
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
          name: "手机号",
          colId: "name"
        },
        {
          name: "姓名",
          colId: "status"
        },
        {
          name: "职位",
          colId: "qrcodeUrl"
        },
        {
          name: "状态",
          colId: "createTime"
        }
      ],
      searchFieldsList: [
        {
          name: "手机号",
          eName: "tableName",
          type: "text",
          placeholder: "请选择桌台名称"
        },
        {
          name: "姓名",
          eName: "tableName",
          type: "text",
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
      getTableList(this.searchParams).then(response => {
        this.listLoading = false;
        this.orderList = response.data.tableList;
      });
    },

    handleAddTable() {
      this.addTableShow = true;
    }
  }
};
</script>
<style scoped type="scss"></style>
