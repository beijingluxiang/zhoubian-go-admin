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
      <el-col v-for="item in formSchema" :span="item.span" :key="item.eName">
        <el-form-item
          v-if="item.condition ? formData[item.condition] : true"
          :label="item.name"
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
          <div v-if="item.type === 'selector'">
            <el-select v-model="formData[item.eName]" placeholder="请选择">
              <el-option
                v-for="item in item.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
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
    },
    formDataProp: {
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
      if (params) {
        this.formData[params.eName] = params.list;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("formSubmit", this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
