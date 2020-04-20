<template>
  <div class="app-container">
    <div
      class="viewSettingWrapper"
      style="background: white; width: 100%; overflow:hidden;"
    >
      <div style="width: 100%; margin: 0 auto;">
        <div
          class="textWrapper"
          style="background: #f0f0f0; margin-bottom: 20px; padding: 10px;"
        >
          <div class="title">
            申请商户流程
          </div>
          <ul class="content">
            <li>
              1、自动注册为周边GO合作商户
            </li>
            <li>
              2、审核通过后为您生成店铺二维码与后台登录密码
            </li>
            <li>
              3、店主可登录后台维护商品售卖信息、价格
            </li>
          </ul>
        </div>
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
            {
              required: false,
              message: "30位中文、英文、数字",
              trigger: "blur"
            }
          ]
        },
        {
          name: "已阅读协议内容",
          eName: "agree",
          type: "checkBox",
          rules: [
            { required: true, message: "请阅读并同意协议", trigger: "blur" }
          ]
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
      register(params.data)
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

.textWrapper {
  .title {
    margin-bottom: 10px;
  }
  .content {
    li {
      margin-bottom: 5px;
      font-size: 12px;
    }
  }
}
</style>
