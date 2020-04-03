<template>
  <div class="app-container">
    <searchComponent
      :searchFieldsList="searchFieldsList"
      :operation="searchOperation"
      @onSearchBtnClicked="searchList"
    ></searchComponent>
    <el-button
      style="margin-top: 20px;"
      type="primary"
      class="btn-add"
      @click="handleAddProduct()"
      size="mini"
    >
      添加商品
    </el-button>
    <el-button
      style="margin-top: 20px;"
      type="primary"
      class="btn-add"
      :disabled="deleteArr.length < 1"
      @click="patchDelete()"
      size="mini"
    >
      批量删除
    </el-button>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="分类" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.categoryName }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"
            ><img style="height: 80px" :src="scope.row.banner[0]"
          /></template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{ scope.row.price }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="scope">
            <p>
              上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.status"
              >
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.inventory }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleEditProduct(scope.row)"
                >编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
      >
        确定
      </el-button>
    </div> -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      :visible.sync="editingVisible"
      top="10px"
      width="80%"
      @closed="onDialogClosed"
    >
      <addComponent
        :editingData="editingData"
        @productUpdated="productUpdated"
      ></addComponent>
    </el-dialog>
  </div>
</template>
<script>
import { updatePublishStatus } from "@/api/product";
import searchComponent from "@/views/components/search";
import addComponent from "@/views/product/add";
import {
  createProduct,
  getProductList,
  editProduct,
  deleteProduct
} from "@/api/product-zy";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};
export default {
  name: "productList",
  components: {
    searchComponent,
    addComponent
  },
  data() {
    return {
      deleteArr: [],
      editingVisible: false,
      editingData: null,
      searchFieldsList: [
        {
          name: "订单编号",
          eName: "orderSn",
          type: "text",
          placeholder: "请选择时间"
        },
        {
          name: "商品名称",
          eName: "productName",
          type: "text",
          placeholder: "请输入订单编号"
        },
        {
          name: "商品状态",
          eName: "publishStatus",
          type: "select",
          options: [
            { label: "已下架", value: 0 },
            { label: "正在出售", value: 1 }
          ],
          placeholder: "请输入用户"
        }
      ],
      searchOperation: ["search", "reset"],
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: "",
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null
      },
      operates: [
        {
          label: "商品上架",
          value: "publishOn"
        },
        {
          label: "商品下架",
          value: "publishOff"
        },
        {
          label: "设为推荐",
          value: "recommendOn"
        },
        {
          label: "取消推荐",
          value: "recommendOff"
        },
        {
          label: "设为新品",
          value: "newOn"
        },
        {
          label: "取消新品",
          value: "newOff"
        },
        {
          label: "转移到分类",
          value: "transferCategory"
        },
        {
          label: "移入回收站",
          value: "recycle"
        }
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "上架"
        },
        {
          value: 0,
          label: "下架"
        }
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过"
        },
        {
          value: 0,
          label: "未审核"
        }
      ]
    };
  },
  created() {
    this.getList();
    // this.getBrandList();
    // this.getProductCateList();
  },
  watch: {
    selectProductCateValue: function(newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    }
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "审核通过";
      } else {
        return "未审核";
      }
    }
  },
  methods: {
    productUpdated() {
      this.editingVisible = false;
      this.editingData = null;
      this.getList();
    },
    handleAddProduct(data) {
      this.editingVisible = true;
      this.editingData = null;
    },
    handleEditProduct(data) {
      this.editingData = data;
      console.log(data, "edit");
      this.editingVisible = true;
    },

    searchList(params) {
      console.log(params, "worinima");
      this.listQuery = params;
      this.orderList = [];
      this.getList();
    },

    onDialogClosed() {
      this.orderList = [];
      this.editingData = null;
      this.getList();
    },

    getList() {
      this.listLoading = true;
      getProductList(this.listQuery).then(response => {
        console.log(response, "worinidaye");
        this.listLoading = false;
        this.list = [];
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },

    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.deleteArr = val.map(_el => _el.id);
      } else {
        this.deleteArr = [];
      }
      console.log(val, "wocaoduoxuan");
    },

    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },

    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let id = row.id;
        deleteProduct([id]).then(res => {
          this.getList();
        });
      });
    },
    patchDelete() {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProduct(this.deleteArr).then(res => {
          this.getList();
        });
      });
    },

    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    }
  }
};
</script>
<style></style>
