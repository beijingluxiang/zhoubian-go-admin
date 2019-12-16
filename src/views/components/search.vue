<template>
  <el-card shadow="never">
    <div>
      <el-form
        :inline="true"
        :model="searchParams"
        size="small"
        label-width="90px"
      >
        <el-form-item v-if="searchFields.orderSn" label="订单编号：">
          <el-input
            v-model="searchParams.orderSn"
            style="width: 150px;"
            placeholder="订单编号"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="searchFields.receiverKeyword" label="收货人：">
          <el-input
            v-model="searchParams.receiverKeyword"
            style="width: 150px;"
            placeholder="收货人姓名/手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="searchFields.createTime" label="提交时间：">
          <el-date-picker
            style="width: 150px;"
            v-model="searchParams.createTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="searchFields.status" label="订单状态：">
          <el-select
            v-model="searchParams.status"
            style="width: 150px;"
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
    <div style="padding-bottom: 30px;">
      <el-button
        style="float:right"
        type="primary"
        @click="handleSearchList()"
        size="small"
      >
        查询搜索
      </el-button>
      <el-button
        style="float:right; margin-right: 15px"
        @click="handleResetSearch()"
        size="small"
      >
        重置
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    searchFieldsList: {
      type: Array
    }
  },
  data: () => {
    return {
      searchParams: {},
      searchFields: {
        orderSn: true,
        receiverKeyword: true,
        createTime: true,
        status: true
      },
      statusOptions: []
    };
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
