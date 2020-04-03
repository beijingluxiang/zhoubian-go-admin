<template>
  <div
    class="viewSettingWrapper"
    style="background: #f0f0f0; width: 100%; overflow:hidden;"
  >
    <div style="width: 75%; margin: 0 auto;">
      <form-creater :formSchema="formSchema"></form-creater>
    </div>
  </div>
</template>
<script>
import {
  fetchIndexBanner,
  createIndexBanner,
  deleteIndexBanner
} from "@/api/home";
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
          eName: "top",
          type: "text",
          span: 12,
          rules: [
            { required: false, message: "请输入店铺名称", trigger: "blur" }
          ]
        },
        {
          name: "减(元)",
          eName: "minus",
          type: "text",
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
          eName: "phone",
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
              eName: "start",
              rules: [{ required: true, message: "开始时间", trigger: "blur" }]
            },
            {
              eName: "end",
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
          eName: "banner",
          type: "images",
          rules: [{ required: true, message: "选择轮播图", trigger: "blur" }]
        },
        {
          name: "是否开通堂食",
          eName: "diningRoom",
          type: "switch",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "是否开通自提",
          eName: "pickup",
          type: "switch",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "是否开通配送",
          eName: "delivery",
          type: "switch",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "配送费用(元)",
          eName: "deliveryFee",
          condition: "delivery",
          type: "text",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "起送金额(元)",
          eName: "deliveryLimitation",
          condition: "delivery",
          type: "text",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "配送区域(公里)",
          eName: "deliveryRange",
          condition: "delivery",
          type: "text",
          span: 8,
          rules: [{ required: true, trigger: "blur" }]
        },
        {
          name: "配送时间段",
          eName: "deliveryTimeRange",
          condition: "delivery",
          type: "timeRange",
          children: [
            {
              eName: "deliveryStart",
              rules: [{ required: true, message: "开始时间", trigger: "blur" }]
            },
            {
              eName: "deliveryEnd",
              rules: [{ required: true, message: "结束时间", trigger: "blur" }]
            }
          ]
        }
      ]
    };
  },
  created() {
    this.getIndexBanner();
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
    getIndexBanner() {
      fetchIndexBanner().then(res => {
        const _data = res.data;
        if (_data.length > 0) {
          console.log(_data);
          // this.upload.imgList = [];
          this.upload.imgList = _data;
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
