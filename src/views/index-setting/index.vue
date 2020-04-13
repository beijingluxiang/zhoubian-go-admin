<template>
  <div class="viewSettingWrapper">
    <uploadComponent
      :title="upload.title"
      :imgList="upload.imgList"
      @onImageChanged="onImageChanged"
    ></uploadComponent>
  </div>
</template>
<script>
import {
  fetchIndexBanner,
  createIndexBanner,
  deleteIndexBanner
} from "@/api/home";
import uploadComponent from "@/views/components/upload-image.vue";
export default {
  name: "orderList",
  components: { uploadComponent },
  data() {
    return {
      bannerList: [],
      upload: {
        title: "首页banner图设置",
        imgList: [],
        summitParams: []
      }
    };
  },
  created() {
    this.getIndexBanner();
  },
  filters: {},
  methods: {
    onImageChanged(params) {
      const _type = params.type;
      if (_type === "upload") {
        this.onImageUpload(params.img);
      }
      console.log(params, "remove");
      if (_type === "remove") {
        this.onImageRemove(params.id);
      }
    },
    onImageRemove(id) {
      if (id) {
        deleteIndexBanner(id).then(res => {
          if (res) {
            this.$message("删除成功");
            this.getIndexBanner();
          }
        });
      }
    },
    onImageUpload(url) {
      createIndexBanner({
        image: url,
        url: url
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
  padding: 20px;
}
</style>
