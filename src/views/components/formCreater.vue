<template>
  <div
    style="background: white; width: 100%; overflow:hidden; border-radius: 6px;"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formCreater"
      :label-width="labelWidth || isMobile ? '80px' : '150px'"
      class="demo-formData"
    >
      <el-col v-for="item in formSchema" :span="item.span" :key="item.eName">
        <el-form-item
          v-if="item.condition ? formData[item.condition] : true"
          :label="item.type !== 'checkBox' ? item.name : ''"
          :prop="item.eName"
        >
          <el-input
            v-if="item.type === 'text'"
            v-model="formData[item.eName]"
          ></el-input>
          <el-input
            v-if="item.type === 'number'"
            :type="item.type"
            v-model="formData[item.eName]"
          ></el-input>
          <div v-if="item.type === 'timeRange'">
            <el-time-select
              v-model="formData[item.children[0].eName]"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
              placeholder="开始时间"
            >
            </el-time-select>
            -
            <el-time-select
              v-model="formData[item.children[1].eName]"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
              placeholder="结束时间"
            >
            </el-time-select>
          </div>
          <div v-if="item.type === 'images'">
            <uploadComponent
              :imgList="formData[item.eName]"
              :id="item.eName"
              @onImageChanged="uploadChange"
            ></uploadComponent>
          </div>
          <div v-if="item.type === 'image'">
            <uploadComponent
              :imgList="formData[item.eName]"
              :id="item.eName"
              @onImageChanged="uploadChange"
              :limit="1"
            ></uploadComponent>
          </div>
          <div v-if="item.type === 'switch'">
            <el-switch
              :active-value="item.active"
              :inactive-value="item.inactive"
              v-model="formData[item.eName]"
            >
            </el-switch>
          </div>
          <div v-if="item.type === 'checkBox'">
            <el-checkbox v-model="formData[item.eName]">{{
              item.name
            }}</el-checkbox>
          </div>

          <div v-if="item.type === 'selector'">
            <el-select
              style="width: 100%;"
              v-model="formData[item.eName]"
              placeholder="请选择"
            >
              <el-option
                v-for="item in item.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>

          <div v-if="item.type === 'chooseCity'">
            <el-select
              style="width: 100%;"
              v-model="formData[item.eName]"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索并选择城市"
              :remote-method="onCitySearched"
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.fullname"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <div v-if="item.type === 'chooseLocation'">
            <el-select
              v-model="formData[item.eName]"
              style="width: 100%;"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索并选择详细地址"
              @change="onLocationChanged"
              :remote-method="onLocationSearched"
            >
              <el-option
                v-for="item in locationOptions"
                :key="item.id"
                :label="item.address"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col>
      <div
        v-for="item in formBtn"
        :key="item.eName"
        style="text-align:center; padding-top: 20px;"
      >
        <el-button
          type="primary"
          :style="{ width: item.width }"
          @click="submitForm('formCreater', item.eName)"
        >
          {{ item.name }}
        </el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
import uploadComponent from "@/views/components/upload-image.vue";
import {
  getInfo,
  updateInfo,
  searchCity,
  searchLocation
} from "@/api/store-setting";
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
    },
    formDataProp: {
      type: null
    },
    formBtn: {
      type: null
    },
    isMobile: {
      type: null
    },
    labelWidth: {
      type: null
    }
  },
  components: { uploadComponent },
  watch: {
    formDataProp: function(val) {
      if (val) {
        this.formData = val;
      } else {
        this.initFormData();
      }
    }
  },
  data() {
    return {
      formData: {},
      cityOptions: [],
      locationOptions: [],
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
    if (this.formDataProp) {
      this.formData = this.formDataProp;
      console.log(this.formDataProp, "hahhforlsdfjlskd");
    } else {
      this.initFormData();
    }
    this.initFormRules();
  },

  methods: {
    initFormData() {
      const _formData = {};
      this.formSchema.forEach(_el => {
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
              _formData[_child.eName] = "";
            });
            break;
          }
          case "images": {
            _formData[_el.eName] = [];
            break;
          }
          case "image": {
            _formData[_el.eName] = [];
            break;
          }
        }
      });
      this.formData = _formData;
    },

    initFormRules() {
      const _rules = {};
      this.formSchema.forEach(_el => {
        if (_el.rules && _el.rules.length > 0) {
          _rules[_el.eName] = _el.rules;
        }
        switch (_el.type) {
          case "timeRange": {
            _el.children.forEach(_child => {
              _rules[_child.eName] = _child.rules;
            });
            break;
          }
        }
      });
      this.rules = _rules;
    },

    uploadChange(params) {
      console.log(params, "uploadchagne");
      if (params) {
        this.formData[params.eName] = params.images;
      }
    },

    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("formSubmit", { data: this.formData, type: type });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onCitySearched(params) {
      console.log(params, "hhh");
      searchCity(params).then(res => {
        if (Array.isArray(res.result)) {
          this.cityOptions = res.result[0];
        }
      });
    },
    onLocationSearched(params) {
      console.log(this.formData.address, "hhh");
      searchLocation(params).then(res => {
        if (Array.isArray(res.data)) {
          this.locationOptions = res.data;
        }
      });
    },
    onLocationChanged(params) {
      if (params) {
        this.formData["address"] = params.address;
        this.formData["city"] = params.city;
        this.formData["location"] = params.location;
      }
    }
  }
};
</script>
