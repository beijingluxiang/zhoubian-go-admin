<template>
  <div style="padding: 20px; background: #f0f0f0;">
    <div
      class="viewSettingWrapper"
      style="background: #f0f0f0; width: 100%; overflow:hidden;"
    >
      <div style="width: 90%; margin: 0 auto;">
        <form-creater
          :formSchema="formSchema"
          :formDataProp="formData"
          @formSubmit="submitNow"
        ></form-creater>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" top="10px">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-dialog :visible.sync="brandManagementVisible" top="10px" width="80%">
      <brandComponent></brandComponent>
    </el-dialog>
    <el-dialog :visible.sync="categoryManagementVisible" top="10px" width="80%">
      <categoryComponent></categoryComponent>
    </el-dialog>
  </div>
</template>

<script>
import brandComponent from "@/views/product/brand/index";
import categoryComponent from "@/views/category/index";
import { createProduct, getProductList, editProduct } from "@/api/product-zy";
import { createCategory, getCategory, editCategory } from "@/api/category";
import { createBrand, getBrand, editBrand } from "@/api/brand-zy";
import uploadComponent from "@/views/components/upload-image.vue";
import formCreater from "@/views/components/formCreater.vue";

export default {
  name: "ProductInfoDetail",
  props: {
    editingData: {
      type: null
    }
  },

  components: {
    brandComponent,
    categoryComponent,
    uploadComponent,
    formCreater
  },
  data() {
    return {
      brandManagementVisible: false,
      categoryManagementVisible: false,
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: ""
      },
      dialogVisible: false,
      dialogImageUrl: null,
      hasEditCreated: false,
      value: {},
      productSize: [
        {
          size: "",
          chengbenPrice: 0,
          vipPrice: 0,
          price: 0,
          fenxiaoPrice: 0,
          active: false
        },
        {
          size: "",
          chengbenPrice: 0,
          vipPrice: 0,
          price: 0,
          fenxiaoPrice: 0,
          active: false
        },
        {
          size: "",
          chengbenPrice: 0,
          vipPrice: 0,
          price: 0,
          fenxiaoPrice: 0,
          active: false
        }
      ],
      distributeSetting: [
        {
          type: 1,
          founder: 0,
          partner: 0,
          vipB: 0
        },
        {
          type: 2,
          founder: 0,
          partner: 0,
          vipA: 0,
          vipB: 0
        }
      ],
      bannerList: [],
      detailImgList: [],
      banner: {
        imgList: [],
        title: null
      },
      detail: {
        imgList: [],
        title: null
      },
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],
      formData: null,
      formSchema: [
        {
          name: "商品名称",
          eName: "name",
          type: "text",
          rules: [
            { required: true, message: "30位中文、英文、数字", trigger: "blur" }
          ]
        },
        {
          name: "商品价格",
          eName: "price",
          type: "number",
          rules: [
            { required: true, message: "纯数字，不能低于0", trigger: "blur" }
          ]
        },
        {
          name: "商品原价",
          eName: "originalPrice",
          type: "number",
          rules: [
            { required: true, message: "纯数字，不能低于0", trigger: "blur" }
          ]
        },
        {
          name: "商品库存",
          eName: "inventory",
          type: "number",
          rules: [
            {
              required: true,
              message: "纯数字, -1为无限库存",
              trigger: "blur"
            }
          ]
        },
        {
          name: "单位",
          eName: "unit",
          type: "text",
          rules: [{ required: true, message: "4位中文英文", trigger: "blur" }]
        },
        {
          name: "商品分类",
          eName: "category",
          type: "selector",
          options: [],
          rules: [{ required: true, message: "选择轮播图", trigger: "blur" }]
        },
        {
          name: "商品图片",
          eName: "banner",
          type: "images",
          rules: [{ required: true, message: "商品图片", trigger: "blur" }]
        },
        {
          name: "详情图片",
          eName: "details",
          type: "images",
          rules: [{ required: true, message: "详情图片", trigger: "blur" }]
        },
        {
          name: "上/下架",
          eName: "status",
          active: 1,
          inactive: 0,
          type: "switch",
          rules: [{ required: true, trigger: "blur" }]
        }
      ]
    };
  },

  watch: {
    editingData: function(newVal) {
      this.formData = newVal;
    }
  },

  created() {},

  mounted() {
    this.getProductCateList();
    if (this.editingData) {
      this.formData = this.editingData;
    }
  },

  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    }
  },

  methods: {
    applyEditingData(data) {
      if (data) {
        this.value = data;
        this.productSize = data.productSize;
        this.banner.imgList = data.bannerList.map(_el => {
          return { url: _el };
        });
        this.detail.imgList = data.detailList.map(_el => {
          return { url: _el };
        });
        this.distributeSetting = data.distributeSetting;
      } else {
        this.value = {};
        this.productSize = [
          {
            size: "",
            chengbenPrice: 0,
            vipPrice: 0,
            price: 0,
            fenxiaoPrice: 0,
            active: false
          },
          {
            size: "",
            chengbenPrice: 0,
            vipPrice: 0,
            price: 0,
            fenxiaoPrice: 0,
            active: false
          },
          {
            size: "",
            chengbenPrice: 0,
            vipPrice: 0,
            price: 0,
            fenxiaoPrice: 0,
            active: false
          }
        ];
        this.banner.imgList = [];
        this.detail.imgList = [];
        this.distributeSetting = [
          {
            type: 1,
            founder: 0,
            partner: 0,
            vipB: 0
          },
          {
            type: 2,
            founder: 0,
            partner: 0,
            vipA: 0,
            vipB: 0
          }
        ];
      }
    },
    onImageChanged(list) {
      this.banner.imgList = list;
      console.log(list);
    },
    onImageChangedDetail(list) {
      this.detail.imgList = list;
      console.log(list);
    },
    manageBrand() {
      this.brandManagementVisible = true;
    },
    manageCategory() {
      this.categoryManagementVisible = true;
    },

    onAddSize() {
      this.productSize.push({
        size: "",
        chengbenPrice: 0,
        vipPrice: 0,
        price: 0,
        fenxiaoPrice: 0,
        active: false
      });
    },

    onRemoveProductSize(index) {
      if (this.productSize.length > 1) {
        this.productSize.splice(index, 1);
      } else {
        this.$message.error("保留至少一种规格");
      }
    },

    //处理编辑逻辑
    handleEditCreated() {
      if (this.value.productCategoryId != null) {
        this.selectProductCateValue.push(this.value.cateParentId);
        this.selectProductCateValue.push(this.value.productCategoryId);
      }
      this.hasEditCreated = true;
    },

    getProductCateList() {
      getCategory().then(response => {
        this.productCateOptions = [];
        this.productCateOptions = response.data;
        this.formSchema.find(_el => _el.eName === "category")["options"] =
          response.data;
      });
    },
    getBrandList() {
      getBrand().then(response => {
        this.brandOptions = [];
        this.brandOptions = response.data;
      });
    },
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.productCateOptions.length; i++) {
        for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
          if (this.productCateOptions[i].children[j].value === id) {
            name = this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },

    handleBrandChange(val) {
      let brandName = "";
      for (let i = 0; i < this.brandOptions.length; i++) {
        if (this.brandOptions[i].value === val) {
          brandName = this.brandOptions[i].label;
          break;
        }
      }
      this.value.brandName = brandName;
    },

    findEmptyValue(arr) {
      let _found = false;
      arr.forEach(_el => {
        for (let _key in _el) {
          if (
            (_key !== "active" && !_el[_key]) ||
            _el[_key] === 0 ||
            _el[_key] === "0"
          ) {
            _found = true;
            break;
          }
        }
      });
      return _found;
    },

    submitNow(params) {
      if (!params) {
        return;
      }
      if (this.editingData) {
        this.$confirm("是否要修改该产品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          editProduct(this.editingData.id, params).then(response => {
            this.$emit("productUpdated");
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000
            });
          });
        });
      } else {
        this.$confirm("是否要提交该产品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          createProduct(params).then(response => {
            this.$emit("productUpdated");
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000
            });
          });
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.el-form {
  .el-form-item {
    .el-form-item__label {
      padding: 0;
      line-height: 26px;
    }
  }
}
</style>
