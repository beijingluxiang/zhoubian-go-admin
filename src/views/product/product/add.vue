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
            v-model="value.brand"
            @change=""
            @visible-change="brandSelectorOpen"
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in brandOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
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
            v-model="value.category"
            @change=""
            @visible-change="categorySelectorOpen"
            placeholder="商品种类："
          >
            <el-option
              v-for="item in productCateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
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
        <el-form-item label="商品库存：">
          <el-input v-model="value.inventory"></el-input>
        </el-form-item>

        <el-form-item label="商品名称：" style="display: block;">
          <el-input v-model="value.productName"></el-input>
        </el-form-item>

        <div style="padding-right: 10px; padding-bottom: 18px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;"
              >商品规格：<span style="font-size:12px; color: #999999"
                >佣金是按“利润配比价”为基础来计算</span
              ></span
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="onAddSize"
              >添加规格</el-button
            >
          </div>

          <el-table style="width: 100%; " :data="productSize" border>
            <el-table-column label="规格名称" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.size"> </el-input>
              </template>
            </el-table-column>
            <el-table-column label="成本价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cost" type="number">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >元</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="高级会员价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.vipPrice" type="number">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >元</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="展示价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.displayPrice" type="number">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >元</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="利润配比价" align="center" type="number">
              <template slot-scope="scope">
                <el-input v-model="scope.row.distributePrice">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >元</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column label="是否启用" width="80" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.active"
                  active-color="#13ce66"
                  inactive-color="#c8c8c8"
                >
                </el-switch>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="onRemoveProductSize(scope.$index, scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="padding-right: 10px; padding-bottom: 18px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;">商品banner图：</span>
          </div>
          <el-card shadow="false" style="margin-top: 5px;">
            <el-upload
              action="http://youxiaoguojingang.oss-cn-beijing.aliyuncs.com"
              :data="dataObj"
              multiple
              list-type="picture-card"
              :file-list="bannerList"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="onBannerSuccess"
              :on-preview="handlePreview"
              :limit="5"
              :on-exceed="handleExceed"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                规格为 1080*810，大小尽量压缩，至少3张
              </div>
            </el-upload>
          </el-card>
        </div>

        <div style="padding-right: 10px; padding-bottom: 18px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;">商品详情图：</span>
          </div>
          <el-card shadow="false" style="margin-top: 5px;">
            <el-upload
              action="http://youxiaoguojingang.oss-cn-beijing.aliyuncs.com"
              :data="dataObj"
              list-type="picture-card"
              multiple
              :file-list="detailImgList"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="onDetailSuccess"
              :on-preview="handlePreview"
              :limit="5"
              :on-exceed="handleExceed"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                规格为 1080*1080，大小尽量压缩，至少5张
              </div>
            </el-upload>
          </el-card>
        </div>

        <div style="padding-right: 10px; padding-bottom: 18px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;">分佣配比设置：</span>
          </div>

          <el-table
            style="width: 100%; margin-top: 5px;"
            :data="distributeSetting"
            border
          >
            <el-table-column label="路线" align="center" width="300">
              <template slot-scope="scope">
                <div class="color-main">
                  {{ scope.row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联合创始人" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.founder">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >%</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="合伙人" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.partner">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >%</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="会员A" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.vipA === 'hide' ? '' : scope.row.vipA"
                  :disabled="scope.row.vipA === 'hide'"
                >
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >%</span
                  >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="会员B" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.vipB">
                  <span
                    style="line-height: 40px; font-size: 14px;"
                    slot="suffix"
                    >%</span
                  >
                </el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-form-item style="text-align: left; display:block;">
          <!-- <el-button
            type="primary"
            size="medium"
            @click="handleNext('productInfoForm')"
            >保存</el-button
          > -->
          <el-button type="primary" size="medium" @click="submitNow"
            >立即上架</el-button
          >
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
import { createProduct, getProduct, updateProduct } from "@/api/product";

export default {
  name: "ProductInfoDetail",
  props: {},
  components: { brandComponent, categoryComponent },
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
          cost: 0,
          vipPrice: 0,
          displayPrice: 0,
          distributePrice: 0,
          active: false
        },
        {
          size: "",
          cost: 0,
          vipPrice: 0,
          displayPrice: 0,
          distributePrice: 0,
          active: false
        },
        {
          size: "",
          cost: 0,
          vipPrice: 0,
          displayPrice: 0,
          distributePrice: 0,
          active: false
        }
      ],
      distributeSetting: [
        {
          type: "路线一：会员C/合伙人/联合创始人",
          founder: 0,
          partner: 0,
          vipA: "hide",
          vipB: 0
        },
        {
          type: "路线二：普通用户",
          founder: 0,
          partner: 0,
          vipA: 0,
          vipB: 0
        }
      ],
      bannerList: [],
      detailImgList: [],
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: []
    };
  },
  created() {
    this.getProductCateList();
    this.getBrandList();
  },
  computed: {
    //商品的编号
    productId() {
      return this.value.id;
    }
  },
  watch: {
    productId: function(newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.productCategoryId = newValue[1];
        this.value.productCategoryName = this.getCateNameById(
          this.value.productCategoryId
        );
      } else {
        this.value.productCategoryId = null;
        this.value.productCategoryName = null;
      }
    }
  },
  methods: {
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
        cost: 0,
        vipPrice: 0,
        displayPrice: 0,
        distributePrice: 0,
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
    handleRemove(file, bannerList) {
      console.log(file, bannerList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    onBannerSuccess(response, file, fileList) {
      this.value.bannerList = fileList.map(_el => {
        return {
          name: file.name,
          url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name
        };
      });
      console.log(response, file, fileList);
    },
    onDetailSuccess(response, file, fileList) {
      this.value.detailList = fileList.map(_el => {
        return {
          name: file.name,
          url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name
        };
      });
      // this.detailImgList.push({
      //   name: file.name,
      //   url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name
      // });
      console.log(response, file, fileList);
    },
    handleExceed(file) {
      console.log(file);
    },
    beforeUpload(file) {
      let _self = this;
      return new Promise((resolve, reject) => {
        policy()
          .then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + "/${filename}";
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            resolve(true);
          })
          .catch(err => {
            console.log(err);
            reject(false);
          });
      });
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
      fetchListWithChildren().then(response => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children
          });
        }
      });
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id
          });
        }
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
    handleNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
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
      console.log(arr, "wocao");
      arr.forEach(_el => {
        for (let _key in _el) {
          if (
            (_key !== "active" && !_el[_key]) ||
            _el[_key] === 0 ||
            _el[_key] === "0"
          ) {
            console.log(_el, _key);
            _found = true;
            break;
          }
        }
      });
      return _found;
    },

    submitNow() {
      console.log(this.bannerList, this.detailImgList);
      const _value = this.value;
      let params = {
        albumPics: _value.bannerList.map(_el => _el.url).toString(),
        brandId: 0,
        brandName: _value.brand,
        deleteStatus: 0,
        detailDesc: "",
        detailHtml: "",
        detailMobileHtml: _value.detailList.map(_el => _el.url).toString(),
        detailTitle: "",
        feightTemplateId: 0,
        flashPromotionCount: 0,
        flashPromotionId: 0,
        flashPromotionPrice: 0,
        flashPromotionSort: 0,
        giftGrowth: 0,
        giftPoint: 0,
        keywords: "11",
        lowStock: 0,
        memberPriceList: [],
        name: _value.productName,
        newStatus: 0,
        normalF: 0,
        normalX: 0,
        normalY: 0,
        normalZ: 0,
        note: "11",
        originalPrice: 0,
        pic: _value.bannerList[0].url,
        prefrenceAreaProductRelationList: [],
        previewStatus: 0,
        price: this.productSize[0].displayPrice,
        productAttributeCategoryId: 17,
        productAttributeValueList: [],
        productCategoryId: 56,
        productCategoryName: _value.category,
        productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
        productLadderList: [{ count: 0, discount: 0, price: 0 }],
        productSn: "",
        promotionEndTime: "",
        promotionPerLimit: 0,
        promotionPrice: null,
        promotionStartTime: "",
        promotionType: 0,
        publishStatus: 0,
        recommandStatus: 0,
        sale: 0,
        serviceIds: "",
        skuStockList: this.productSize.map(_el => {
          return {
            sp1: _el.size,
            price: _el.displayPrice,
            vipPrice: _el.vipPrice,
            chengbenProce: _el.cost,
            fenxiaoPrice: _el.distributePrice
          };
        }),
        sort: 0,
        stock: _value.inventory,
        subTitle: "副标题",
        subjectProductRelationList: [],
        unit: "",
        usePointLimit: 0,
        verifyStatus: 0,
        vipPrice: this.productSize[0].vipPrice,
        vipX: 0,
        vipY: 0,
        vipZ: 0,
        weight: 0
      };
      console.log(params, "worinima");
      switch (true) {
        case !this.value.brand: {
          this.$message.error("未选择供应商");
          break;
        }
        case !this.value.category: {
          this.$message.error("未选择品类");
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
        case this.findEmptyValue(this.productSize): {
          this.$message.error("商品规格未填写完整");
          break;
        }
        case _value.bannerList.length === 0: {
          this.$message.error("未上传商品banner图");
          break;
        }
        case _value.detailList.length === 0: {
          this.$message.error("未上传商品详情图");
          break;
        }
        // case this.findEmptyValue(this.distributeSetting): {
        //   this.$message.error("分佣配比设置未填写完整");
        //   break;
        // }
        default: {
          this.$confirm("是否要提交该产品", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            createProduct(params).then(response => {
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
