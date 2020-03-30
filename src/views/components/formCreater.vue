<template>
  <div
    style="padding: 40px; background: white; width: 100%; overflow:hidden; border-radius: 6px;"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formCreater"
      label-width="150px"
      class="demo-formData"
    >
      <el-col v-for="item in formSchema" :span="item.span">
        <el-form-item
          v-if="item.condition ? formData[item.condition] : true"
          :key="item.eName"
          :label="item.name"
          :prop="item.eName"
        >
          <el-input
            v-if="item.type === 'text'"
            v-model="formData[item.eName]"
          ></el-input>
          <div v-if="item.type === 'timeRange'">
            <el-time-picker
              v-model="formData[item.children[0].eName]"
              placeholder="开始时间"
            >
            </el-time-picker>
            —
            <el-time-picker
              v-model="formData[item.children[1].eName]"
              placeholder="结束时间"
            >
            </el-time-picker>
          </div>
          <div v-if="item.type === 'images'">
            <uploadComponent
              v-bind:imgList="formData[item.eName]"
            ></uploadComponent>
          </div>
          <div v-if="item.type === 'image'">
            <uploadComponent
              v-bind:imgList="formData[item.eName]"
              :limit="1"
            ></uploadComponent>
          </div>
          <div v-if="item.type === 'switch'">
            <el-switch v-model="formData[item.eName]"> </el-switch>
          </div>
        </el-form-item>
      </el-col>

      <!-- <el-form-item label="活动名称" prop="name">
  <el-input v-model="formData.name"></el-input>
</el-form-item>
<el-form-item label="活动区域" prop="region">
  <el-select v-model="formData.region" placeholder="请选择活动区域">
    <el-option label="区域一" value="shanghai"></el-option>
    <el-option label="区域二" value="beijing"></el-option>
  </el-select>
</el-form-item>
<el-form-item label="活动时间" required>
  <el-col :span="11">
    <el-form-item prop="date1">
      <el-date-picker
      type="date"
      placeholder="选择日期"
      v-model="formData.date1"
      style="width: 100%;"
      ></el-date-picker>
    </el-form-item>
  </el-col>
  <el-col class="line" :span="2">-</el-col>
  <el-col :span="11">
    <el-form-item prop="date2">
      <el-time-picker
      placeholder="选择时间"
      v-model="formData.date2"
      style="width: 100%;"
      ></el-time-picker>
    </el-form-item>
  </el-col>
</el-form-item>
<el-form-item label="即时配送" prop="delivery">
  <el-switch v-model="formData.delivery"></el-switch>
</el-form-item>
<el-form-item label="活动性质" prop="type">
  <el-checkbox-group v-model="formData.type">
    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
    <el-checkbox label="地推活动" name="type"></el-checkbox>
    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
  </el-checkbox-group>
</el-form-item>
<el-form-item label="特殊资源" prop="resource">
  <el-radio-group v-model="formData.resource">
    <el-radio label="线上品牌商赞助"></el-radio>
    <el-radio label="线下场地免费"></el-radio>
  </el-radio-group>
</el-form-item>
<el-form-item label="活动形式" prop="desc">
  <el-input type="textarea" v-model="formData.desc"></el-input>
</el-form-item>
<el-form-item>
  <el-button type="primary" @click="submitForm('formData')"
  >立即创建</el-button
  >
  <el-button @click="resetForm('formData')">重置</el-button>
</el-form-item> -->
    </el-form>
    <el-col>
      <div style="text-align:center; padding-top: 20px;">
        <el-button type="primary" @click="submitForm('formCreater')"
          >保存</el-button
        >
        <el-button @click="resetForm('formCreater')">重置</el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
import uploadComponent from "@/views/components/upload-image.vue";
import {
  fetchIndexBanner,
  createIndexBanner,
  deleteIndexBanner
} from "@/api/home";
export default {
  name: "form-creater",
  props: {
    formSchema: {
      type: null
    }
    // formData: {
    //   type: null
    // }
  },
  components: { uploadComponent },
  data() {
    return {
      formData: {},
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  created() {
    const _rules = {};
    const _formData = {};
    this.formSchema.forEach(_el => {
      if (_el.rules && _el.rules.length > 0) {
        _rules[_el.eName] = _el.rules;
      }
      switch (_el.type) {
        case "text": {
          _formData[_el.eName] = "";
          break;
        }
        case "switch": {
          _formData[_el.eName] = false;
          break;
        }
        case "timeRange": {
          _el.children.forEach(_child => {
            _rules[_child.eName] = _child.rules;
            _formData[_child.eName] = "";
          });
          break;
        }
        case "images": {
          _formData[_el.eName] = [
            "https://i.loli.net/2020/03/22/U8H75KMXWmbJBiL.jpg",
            "https://i.loli.net/2020/03/22/RJLK6DgmXrx4OBZ.jpg",
            "https://i.loli.net/2020/03/22/z4m3gBdUWqvkKHs.jpg"
          ];
          break;
        }
        case "image": {
          _formData[_el.eName] = [
            "https://i.loli.net/2020/03/22/U8H75KMXWmbJBiL.jpg",
            "https://i.loli.net/2020/03/22/RJLK6DgmXrx4OBZ.jpg",
            "https://i.loli.net/2020/03/22/z4m3gBdUWqvkKHs.jpg"
          ];
          break;
        }
      }
    });
    this.rules = _rules;
    this.formData = _formData;
    console.log(_rules, this.formData, "hahwori");
  },
  methods: {
    submitForm(formName) {
      console.log(this.formData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onBannerChanged(fileList) {},
    onBannerRemove(file) {
      if (file.id) {
        deleteIndexBanner(file.id).then(res => {
          this.getIndexBanner();
        });
      }
    },
    onBannerUpload(file) {
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
          this.formData.banner = _data;
        }
      });
    }
  }
};
</script>
