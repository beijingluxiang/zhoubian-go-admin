<template>
  <div style="padding: 20px 100px; background: #f0f0f0;">
    <div style="background: white; padding: 20px;">
      <el-form
        class="form-product-add"
        :model="value"
        :inline="true"
        :label-position="'top'"
        ref="productInfoForm"
        label-width="120px"
        style="width: 100%;"
        size="small"
      >
        <el-form-item label="供应商：" prop="productCategoryId">
          <el-select
            v-model="value.brandId"
            @change=""
            @visible-change="brandSelectorOpen"
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-button
            size="small"
            style="margin-left: 10px;"
            @click="manageBrand"
            >管理供应商</el-button
          >
        </el-form-item>
        <el-form-item label="商品种类：" prop="productCategoryId">
          <el-select
            v-model="value.categoryId"
            @change=""
            @visible-change="categorySelectorOpen"
            placeholder="商品种类："
          >
            <el-option
              v-for="item in productCateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-button
            size="small"
            style="margin-left: 10px;"
            @click="manageCategory"
            >管理果类</el-button
          >
        </el-form-item>
        <el-form-item label="商品规格：">
          <el-input v-model="value.size"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：">
          <el-input v-model="value.inventory"></el-input>
        </el-form-item>

        <el-form-item label="商品名称：" style="display: block;">
          <el-input v-model="value.productName"></el-input>
        </el-form-item>

        <div style="padding-right: 10px; padding-bottom: 18px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;">商品banner图：</span>
          </div>
          <uploadComponent
            :title="banner.title"
            :imgList="banner.imgList"
            @onImageChanged="onImageChanged"
          ></uploadComponent>
        </div>

        <div style="padding-right: 10px; padding-bottom: 18px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;">商品详情图：</span>
          </div>
          <uploadComponent
            :title="detail.title"
            :imgList="detail.imgList"
            @onImageChanged="onImageChangedDetail"
          ></uploadComponent>
        </div>

        <el-form-item style="text-align: left; display:block;">
          <!-- <el-button
            type="primary"
            size="medium"
            @click="handleNext('productInfoForm')"
            >保存</el-button
          > -->
          <el-button type="primary" size="medium" @click="submitNow">{{
            this.editingData ? "提交修改" : "立即上架"
          }}</el-button>
        </el-form-item>
      </el-form>
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
import { fetchListWithChildren } from "@/api/productCate";
import { fetchList as fetchBrandList } from "@/api/brand";
import { policy } from "@/api/oss";
import brandComponent from "@/views/product/brand/index";
import categoryComponent from "@/views/product/productCate/index";
import { createProduct, getProductList, editProduct } from "@/api/product-vip";
import { createCategory, getCategory, editCategory } from "@/api/category";
import { createBrand, getBrand, editBrand } from "@/api/brand-zy";
import uploadComponent from "@/views/components/upload-image.vue";

export default {
  name: "ProductInfoDetail",
  props: {
    editingData: {
      type: null
    }
  },

  watch: {
    editingData: function(newVal, oldVal) {
      console.log("hahhaha", newVal);

      this.applyEditingData(newVal);
    }
  },
  components: { brandComponent, categoryComponent, uploadComponent },
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
      brandOptions: []
    };
  },
  created() {
    this.getProductCateList();
    this.getBrandList();

    this.applyEditingData(this.editingData);
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
        this.value.size = data.productSize[0].size;
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
          }
        ];
        this.banner.imgList = [];
        this.detail.imgList = [];
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
    brandSelectorOpen() {
      this.getBrandList();
    },
    categorySelectorOpen() {
      this.getProductCateList();
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

    submitNow() {
      console.log(this.bannerList, this.detailImgList, _value);
      const _value = this.value;
      let params = {
        free: true,
        brandId: _value.brandId, // 必填，品牌id，来自于“品牌相关接口”里边的list接口
        categoryId: _value.categoryId, // 必填，类别id，来自于“类别相关接口”里边的list接口
        productName: _value.productName, // 必填，商品名称
        productPrice: this.productSize[0].price, // 必填， 商品针对普通用户展示的价格， 注意只是展示，下单用的是productSize里边的价格
        productVipPrice: this.productSize[0].vipPrice, // 必填，商品针对VIP用户展示的价格， 注意只是展示，下单用的是productSize里边的价格
        publishStatus: 1, // 必填，是否上架，1表示上架，0表示不上架
        inventory: _value.inventory, // 必填，库存，目前没什么用
        bannerList: this.banner.imgList.map(_el => _el.url),
        detailList: this.detail.imgList.map(_el => _el.url),
        distributeSetting: this.distributeSetting,
        productSize: [
          {
            size: _value.size,
            stock: _value.inventory,
            skuCode: ""
          }
        ]
      };

      switch (true) {
        case !this.value.brandId: {
          this.$message.error("未选择供应商");
          break;
        }
        case !this.value.categoryId: {
          this.$message.error("未选择品类");
          break;
        }
        case !this.value.size: {
          this.$message.error("未填写规格");
          break;
        }
        case !this.value.inventory: {
          this.$message.error("未填写库存");
          break;
        }
        case !this.value.productName: {
          this.$message.error("未填写商品名称");
          break;
        }
        case this.banner.imgList.length === 0: {
          this.$message.error("未上传商品banner图");
          break;
        }
        case this.detail.imgList.length === 0: {
          this.$message.error("未上传商品详情图");
          break;
        }
        default: {
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
