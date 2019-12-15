<template>
  <el-card class="filter-container" shadow="never">
    <div>
      <i class="el-icon-search"></i>
      <span>筛选搜索</span>
      <el-button
        style="float:right"
        type="primary"
        @click="handleSearchList()"
        size="small"
      >
        查询搜索
      </el-button>
      <el-button
        style="float:right;margin-right: 15px"
        @click="handleResetSearch()"
        size="small"
      >
        重置
      </el-button>
    </div>
    <div style="margin-top: 15px">
      <el-form
        :inline="true"
        :model="listQuery"
        size="small"
        label-width="80px"
      >
        <el-form-item label="订单编号：">
          <el-input
            v-model="listQuery.orderSn"
            class="input-width"
            placeholder="订单编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货人：">
          <el-input
            v-model="listQuery.receiverKeyword"
            class="input-width"
            placeholder="收货人姓名/手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="提交时间：">
          <el-date-picker
            class="input-width"
            v-model="listQuery.createTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态：">
          <el-select
            v-model="listQuery.status"
            class="input-width"
            placeholder="全部"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    listQuery: {
      type: Object
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden;
      });
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    }
  }
};
</script>
