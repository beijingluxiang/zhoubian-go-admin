<template>
  <div>
    <div>
      <div slot="header">
        <span style="font-size: 14px;">{{ title }}</span>
      </div>
      <el-card shadow="false" style="margin-top: 5px;">
        <el-upload
          class="upload-component"
          action="http://udbeing-test.oss-cn-hangzhou.aliyuncs.com"
          :data="dataObj"
          multiple
          list-type="picture-card"
          :file-list="dataImgList"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :on-success="onUploadSuccess"
          :on-preview="handlePreview"
          :on-change="handleChange"
          :limit="limit"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogVisible" top="10px">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { policy } from "@/api/oss";
export default {
  props: {
    title: {
      type: null
    },
    imgList: {
      type: null
    },
    limit: {
      type: null
    },
    id: {
      type: null
    }
  },
  name: "orderList",
  components: {},
  data() {
    return {
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: ""
      },
      dataImgList: [],
      uploadName: "",
      dialogImageUrl: null,
      dialogVisible: false
    };
  },
  created() {
    if (Array.isArray(this.imgList)) {
      let newArr = this.imgList.map(_el => {
        return {
          image: _el,
          url: _el
        };
      });
      this.dataImgList = newArr;
    }
  },
  filters: {},
  methods: {
    handleChange(file, fileList) {
      const _arr = fileList.map(_el => _el.url);
      this.$emit("onImageChanged", { eName: this.id, list: _arr });
    },
    handleRemove(file, fileList) {
      this.$emit("onImageRemove", file);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },

    onUploadSuccess(response, file, fileList) {
      file.url = this.uploadName;
      // this.$emit("onImageUpload", file);
    },
    handleExceed(file) {
      console.log(file);
    },

    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },

    beforeUpload(file) {
      console.log(file, "worinimabi");
      const _name = file.name;
      const _split = _name.split(".");
      const _timeStamp = Date.now();
      const _newName = _split[0] + "_" + _timeStamp + "." + _split[1];
      console.log(_timeStamp, _newName);

      let _self = this;
      return new Promise((resolve, reject) => {
        policy()
          .then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + _newName;
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            _self.uploadName =
              response.data.host + "/" + response.data.dir + _newName;
            resolve(true);
          })
          .catch(err => {
            console.log(err);
            reject(false);
          });
      });
    }
  }
};
</script>
<style scoped type="scss"></style>
