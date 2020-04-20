<template>
  <div class="viewSettingWrapper" style="width: 100%; overflow:hidden;">
    <div style="width: 75%; margin: 0 auto;">
      <div style="margin-left: 150px; margin-bottom: 20px;">
        <el-popover placement="top-start" title="" width="250" trigger="hover">
          <div style="text-align:center;">
            <div style="font-size: 12px; text-align: center; padding: 10px 0;">
              店铺二维码，右键保存到本地
            </div>
            <img style="width: 200px;" :src="qrcodeUrl" />
          </div>
          <el-button slot="reference">查看店铺二维码</el-button>
        </el-popover>
        <span style="color: red; font-size: 12px; margin-left: 20px;"
          >店铺二维码不可修改，如有疑问请联系运维人员</span
        >
      </div>
      <form-creater
        :formSchema="formSchema"
        :formDataProp="formData"
        :formBtn="formBtn"
        @formSubmit="onFormSubmit"
      ></form-creater>
    </div>
  </div>
</template>
<script>
import {
  getInfo,
  updateInfo,
  searchCity,
  searchLocation
} from "@/api/store-setting";
import formCreater from "@/views/components/formCreater.vue";
export default {
  name: "orderList",
  components: { formCreater },
  data() {
    return {
      bannerList: [],
      qrcodeUrl: "",
      upload: {
        title: "首页banner图设置",
        imgList: [],
        summitParams: []
      },
      formBtn: [{ name: "保存", eName: "save", width: "200px" }],
      formData: {},
      formSchema: [
        {
          name: "店铺名称",
          eName: "name",
          type: "text",
          rules: [
            { required: true, message: "请输入店铺名称", trigger: "blur" }
          ]
        },
        {
          name: "满减活动：满(元)",
          eName: "fullDeductionThreshold",
          type: "number",
          span: 12,
          rules: [
            { required: false, message: "请输入店铺名称", trigger: "blur" }
          ]
        },
        {
          name: "减(元)",
          eName: "fullDeduction",
          type: "number",
          span: 12,
          rules: [
            { required: false, message: "请输入店铺名称", trigger: "blur" }
          ]
        },
        {
          name: "省市区位",
          eName: "address",
          type: "chooseLocation",
          options: [],
          rules: [{ required: true, message: "所在区位", trigger: "blur" }]
        },
        {
          name: "详细地址",
          eName: "addressDetail",
          type: "text",
          options: [],
          rules: [{ required: true, message: "详细地址", trigger: "blur" }]
        },
        {
          name: "联系电话",
          eName: "shopNumber",
          type: "text",
          rules: [{ required: true, message: "联系电话", trigger: "blur" }]
        },
        {
          name: "营业时间",
          eName: "openTime",
          type: "timeRange",
          children: [
            {
              eName: "openTimeStartStr",
              rules: [{ required: true, message: "开始时间", trigger: "blur" }]
            },
            {
              eName: "openTimeEndStr",
              rules: [{ required: true, message: "结束时间", trigger: "blur" }]
            }
          ]
        },
        {
          name: "店铺logo",
          eName: "logo",
          type: "image",
          rules: [{ required: true, message: "选择轮播图", trigger: "blur" }]
        },
        {
          name: "轮播图",
          eName: "bannerList",
          type: "images",
          rules: [{ required: true, message: "选择轮播图", trigger: "blur" }]
        },
        {
          name: "是否开通堂食",
          eName: "allowEatIndoor",
          type: "switch",
          active: 1,
          inactive: 0,
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "是否开通自提",
          eName: "allowSelfTake",
          type: "switch",
          active: 1,
          inactive: 0,
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "是否开通配送",
          eName: "allowDelivery",
          type: "switch",
          active: 1,
          inactive: 0,
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "配送费用(元)",
          eName: "deliveryFee",
          condition: "allowDelivery",
          type: "text",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "起送金额(元)",
          eName: "startDeliveryFee",
          condition: "allowDelivery",
          type: "text",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "配送区域(公里)",
          eName: "deliveryArea",
          condition: "allowDelivery",
          type: "text",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "配送时间段",
          eName: "deliveryTimeRange",
          condition: "allowDelivery",
          type: "timeRange",
          children: [
            {
              eName: "deliveryTimeStartStr",
              rules: [{ required: true, message: "开始时间", trigger: "blur" }]
            },
            {
              eName: "deliveryTimeEndStr",
              rules: [{ required: true, message: "结束时间", trigger: "blur" }]
            }
          ]
        }
      ]
    };
  },
  created() {
    this.getStoreInfo();
  },
  mounted() {},
  filters: {},
  methods: {
    onFormSubmit(params) {
      const _data = params.data;
      if (
        !_data.allowEatIndoor &&
        !_data.allowSelfTake &&
        !_data.allowDelivery
      ) {
        this.$message({ message: "必须选择一种发货方式", type: "warning" });
        return;
      }
      updateInfo(params.data).then(res => {
        if (res) {
          this.$message("店铺设置保存成功");
        }
      });
    },
    onImageChanged(fileList) {},
    onImageRemove(file) {
      if (file.id) {
        deleteIndexBanner(file.id).then(res => {
          this.getIndexBanner();
        });
      }
    },
    onImageUpload(file) {
      createIndexBanner({
        image: file.url,
        url: file.url
      }).then(res => {
        this.getIndexBanner();
      });
    },
    getStoreInfo() {
      getInfo().then(res => {
        const _data = res.data;
        this.qrcodeUrl = _data.qrcodeUrl;
        if (_data) {
          console.log(_data);
          // this.upload.imgList = [];
          this.formData = _data;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.viewSettingWrapper {
  width: 60%;
  margin: 0 auto;
  padding: 20px 0 20px 0;
}
</style>
