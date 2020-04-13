<template>
  <div>
    <div>
      <div slot="header">
        <span style="font-size: 14px;">{{ title }}</span>
      </div>
      <el-card shadow="false" style="margin-top: 5px;">
        <el-upload
          v-if="showImgList.length !== limit"
          class="upload-component"
          action="http://gogogo-test.oss-cn-hangzhou.aliyuncs.com"
          :data="dataObj"
          multiple
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="onUploadSuccess"
          :on-change="handleChange"
          :on-exceed="handleExceed"
        >
          <div style="text-align:left;">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" style="line-height: 30px;">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </div>
        </el-upload>
        <div style="overflow:hidden;">
          <div
            class="imageWrapper"
            v-for="(img, index) in showImgList"
            :key="index"
            style="float:left; width: 200px; height: 200px; overflow:hidden; padding: 10px; background: #f0f0f0; margin-right: 10px; position: relative; margin-bottom: 10px;"
          >
            <div
              class="icons"
              style="position: absolute; right: 0; width: 100%; height: 100%; background: rgba(0,0,0,.3); color: white; line-height: 200px; font-size: 20px; cursor: pointer; text-align:center;"
            >
              <i
                style="margin-right: 20px;"
                class="el-icon-search"
                @click="handlePreview(img.image)"
              ></i>
              <i class="el-icon-delete" @click="handleRemove(index, img)"></i>
            </div>
            <img style="width: 100%;" :src="img.image" />
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogVisible" top="10px">
      <div style="padding: 20px;">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </div>
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
        host: "",
        success_action_status: "",
        callback: null
      },
      showImgList: [],
      uploadName: "",
      dialogImageUrl: null,
      dialogVisible: false
    };
  },

  watch: {
    imgList: function(val) {
      console.log(val, "worinimamfskdfajdsf");
      if (val) {
        let newArr = val.map(_el => {
          return {
            image: _el.image || _el,
            id: _el.id || ""
          };
        });
        this.showImgList = newArr;
      }
    }
  },

  created() {
    if (Array.isArray(this.imgList)) {
      let newArr = this.imgList.map(_el => {
        return {
          image: _el.image || _el,
          id: _el.id || ""
        };
      });
      this.showImgList = newArr;
    }
  },

  methods: {
    handleChange(file, fileList) {
      console.log(file, fileList, "changeed");
    },

    handleRemove(index, image) {
      this.showImgList.splice(index, 1);
      this.$emit("onImageChanged", {
        eName: this.id,
        id: image.id || "",
        images: this.showImgList.map(_el => _el.image),
        type: "remove"
      });
    },

    onUploadSuccess(response) {
      console.log("wirinimachenggongle", response);
      const _image = response.data.filename;
      let _arr = this.showImgList.map(_el => _el.image);
      _arr.push(_image);
      this.$emit("onImageChanged", {
        eName: this.id,
        images: _arr,
        img: _image,
        type: "upload"
      });
    },

    handleExceed(file) {},

    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file;
    },

    beforeUpload(file) {
      const _name = file.name;
      const _split = _name.split(".");
      const _timeStamp = Date.now();
      const _newName = _split[0] + "_" + _timeStamp + "." + _split[1];

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
            _self.dataObj["success_action_status"] = "200";
            _self.dataObj.callback = response.data.callback;
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
<style scoped lang="scss">
.imageWrapper {
  .icons {
    top: -100%;
  }
  &:hover {
    .icons {
      top: 0;
    }
  }
}
</style>
