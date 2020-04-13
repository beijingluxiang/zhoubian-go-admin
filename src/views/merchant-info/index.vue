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

    <el-dialog title="添加桌台" :visible.sync="editShow" width="50%" top="10px">
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
import { getRegisteredList, updateRegisterDetail } from "@/api/maintenance";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/register/detail.vue";
import formCreater from "@/views/components/formCreater";
export default {
  name: "orderList",
  components: {
    searchComponent,
    gridComponent,
    orderDetailComponent,
    formCreater
  },
  data() {
    return {
      editShow: false,
      formBtn: [{ name: "保存", eName: "save", width: "200px" }],
      formData: null,
      formSchema: [
        {
          name: "商户名称",
          eName: "name",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "所属地区",
          eName: "address",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "商户地址",
          eName: "addressDetail",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "所属行业",
          eName: "category",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "联系人",
          eName: "contactPerson",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "联系电话",
          eName: "contact",
          type: "text",
          rules: [{ required: true, message: "11位有效电话", trigger: "blur" }]
        },
        {
          name: "商户号",
          eName: "shopNumber",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "后台用户名",
          eName: "adminUserName",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "后台密码",
          eName: "adminPassword",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        }
      ],
      operations: ["edit", "disable"],
      operations: [
        { name: "编辑", eName: "edit", type: "mormal" },
        {
          name: "禁用",
          eName: "disable",
          type: "primary",
          condition: { colId: "enabled", value: true }
        },
        {
          name: "启用",
          eName: "enable",
          type: "primary",
          condition: { colId: "enabled", value: false }
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
          colId: "contact"
        },
        {
          name: "商户号",
          colId: "shopNumber"
        },
        {
          name: "后台用户名",
          colId: "adminUserName"
        },
        {
          name: "后台密码",
          colId: "adminPassword"
        },
        {
          name: "状态",
          colId: "enabledDesc"
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
          eName: "enabled",
          type: "select",
          options: [
            { label: "已启用", value: true },
            { label: "已禁用", value: false }
          ],
          placeholder: "商户状态"
        }
      ],
      searchOperation: ["search", "reset"],
      currentId: null
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
          this.currentId = _id;
          this.formData = _data;
          this.editShow = true;
          break;
        }
        case "disable": {
          this.$confirm("是否拒绝商家申请?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            _data.enabled = false;
            updateRegisterDetail(_id, _data).then(res => {
              this.$message("操作成功");
              this.getList();
            });
          });
          break;
        }
        case "enable": {
          this.$confirm("是否同意商家申请?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            _data.enabled = true;
            updateRegisterDetail(_id, _data).then(res => {
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
      updateRegisterDetail(this.currentId, params.data)
        .then(res => {
          this.editShow = false;
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
      getRegisteredList(this.searchParams).then(response => {
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
