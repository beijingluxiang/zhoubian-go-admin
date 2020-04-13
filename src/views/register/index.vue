<template>
  <div class="app-container">
    <div
      class="viewSettingWrapper"
      style="background: white; width: 100%; overflow:hidden; padding-top: 20px;"
    >
      <div style="width: 100%; margin: 0 auto;">
        <form-creater
          :formSchema="formSchema"
          :formDataProp="formData"
          :isMobile="true"
          :formBtn="formBtn"
          @formSubmit="submitNow"
        ></form-creater>
      </div>
    </div>
  </div>
</template>
<script>
import { register } from "@/api/maintenance";
import searchComponent from "@/views/components/search";
import gridComponent from "@/views/components/grid";
import orderDetailComponent from "@/views/register/detail.vue";
import formCreater from "@/views/components/formCreater.vue";
export default {
  name: "orderList",
  components: {
    searchComponent,
    formCreater,
    gridComponent,
    orderDetailComponent
  },
  data() {
    return {
      addTableShow: false,
      orderList: [],
      deliveryParams: null,
      searchParams: {},
      productDetailVisible: false,
      deliveryVisible: false,
      detailId: null,
      formData: null,
      formBtn: [{ name: "保存", eName: "save", width: "100%" }],
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
          name: "已阅读协议内容",
          eName: "agree",
          type: "checkBox",
          rules: [{ required: true, trigger: "blur" }]
        }
      ]
    };
  },
  created() {
    // this.getList(null);
  },
  filters: {},
  methods: {
    submitNow(params) {
      register(params)
        .then(res => {
          this.$message("注册成功，请关闭次页面");
        })
        .catch(err => {
          this.$message("注册失败，请联系管理员");
          console.log(err);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.app-container {
  .demo-formData {
    .el-form-item {
      .el-form-item__label {
        width: 30px;
        background: red;
      }
    }
  }
}
</style>
