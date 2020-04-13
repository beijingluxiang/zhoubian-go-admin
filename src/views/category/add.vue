<template>
  <el-card class="form-container" style="width: 600px;" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="商品分类：" prop="name">
        <el-input v-model="brandName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')"
          >提交</el-button
        >
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createCategory, getCategory, editCategory } from "@/api/category";
import SingleUpload from "@/components/Upload/singleUpload";
const defaultBrand = {
  bigPic: "",
  brandStory: "",
  brandName: "",
  factoryStatus: 0,
  firstLetter: "",
  logo: "",
  name: "",
  showStatus: 0,
  sort: 0
};
export default {
  name: "BrandDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editingData: {
      type: null
    }
  },
  data() {
    return {
      brand: Object.assign({}, defaultBrand),
      brandName: "",
      brandId: null,
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        logo: [{ required: true, message: "请输入商品logo", trigger: "blur" }],
        sort: [{ type: "number", message: "排序必须为数字" }]
      }
    };
  },
  watch: {
    editingData: function(val) {
      if (val) {
        this.brandName = val.name;
        this.brandId = val.id;
      }
    }
  },
  created() {
    if (this.editingData) {
      this.brandName = this.editingData.name;
      this.brandId = this.editingData.id;
    }
  },
  methods: {
    onSubmit(formName) {
      this.$confirm("是否提交数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.editingData) {
          editCategory(this.editingData.id, this.brandName).then(response => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
          });
        } else {
          createCategory(this.brandName).then(response => {
            this.$message({
              message: "提交成功",
              type: "success",
              duration: 1000
            });
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.brand = Object.assign({}, defaultBrand);
    }
  }
};
</script>
<style></style>
