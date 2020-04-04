<template>
  <div
    class="viewSettingWrapper"
    style="background: #f0f0f0; width: 100%; overflow:hidden;"
  >
    <div style="width: 75%; margin: 0 auto;">
      <form-creater
        :formSchema="formSchema"
        :formDataProp="formData"
      ></form-creater>
    </div>
  </div>
</template>
<script>
import { getInfo, updateInfo } from "@/api/store-setting";
import formCreater from "@/views/components/formCreater.vue";
export default {
  name: "orderList",
  components: { formCreater },
  data() {
    return {
      bannerList: [],
      upload: {
        title: "首页banner图设置",
        imgList: [],
        summitParams: []
      },
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
          name: "店铺地址",
          eName: "address",
          type: "text",
          rules: [
            { required: true, message: "请输入店铺地址", trigger: "blur" }
          ]
        },
        {
          name: "联系电话",
          eName: "shopNumber",
          type: "text",
          rules: [
            { required: true, message: "请输入店铺地址", trigger: "blur" }
          ]
        },
        {
          name: "营业时间",
          eName: "openTime",
          type: "timeRange",
          rules: [{ required: true }],
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
          inActive: 0,
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "是否开通自提",
          eName: "allowSelfTake",
          type: "switch",
          active: 1,
          inActive: 0,
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "是否开通配送",
          eName: "allowDelivery",
          type: "switch",
          active: 1,
          inActive: 0,
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
  created() {},
  mounted() {
    this.getStoreInfo();
  },
  filters: {},
  methods: {
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
