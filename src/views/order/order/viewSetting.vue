<template>
  <div class="viewSettingWrapper">
    <uploadComponent
      :title="upload.title"
      :imgList="upload.imgList"
      @onImageChanged="onImageChanged"
      @onImageRemove="onImageRemove"
      @onImageUpload="onImageUpload"
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
}
</style>
