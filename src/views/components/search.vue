<template>
  <el-card shadow="never">
    <div style="float:left; width: 85%;">
      <el-form
        :inline="true"
        :model="searchParams"
        size="mini"
        label-width="90px"
      >
        <el-form-item
          v-for="item in searchFieldsList"
          :key="item.eName"
          :label="item.name"
        >
          <el-date-picker
            v-if="item.type === 'dateTimeRange'"
            style="width: 100px;"
            v-model="searchParams[item.eName]"
            value-format="yyyy-MM-dd"
            type="date"
            :placeholder="item.placeholder"
          >
          </el-date-picker>

          <el-input
            v-if="item.type === 'text'"
            v-model="searchParams[item.eName]"
            style="width: 100px;"
            :placeholder="item.placeholder"
          ></el-input>

          <el-select
            v-if="item.type === 'select'"
            v-model="searchParams[item.eName]"
            style="width: 100px;"
            placeholder="全部"
            clearable
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              {{ option.label }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="float:right;">
      <div v-for="o in operation" :key="o" style="float:right;">
        <el-button
          v-if="o === 'export'"
          style="float:right; margin-left: 15px"
          @click="onExport()"
          size="mini"
        >
          导出
        </el-button>
        <el-button
          v-if="o === 'reset'"
          style="float:right; margin-left: 15px"
          @click="onReset()"
          size="mini"
        >
          重置
        </el-button>
        <el-button
          v-if="o === 'search'"
          style="float:right; margin-left: 15px;"
          type="primary"
          @click="onSearch()"
          size="mini"
        >
          搜索
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "search-component",
  props: {
    searchFieldsList: {
      type: Array
    },
    operation: {
      type: Array
    }
  },
  data() {
    return {
      searchParams: {}
    };
  },
  methods: {
    onReset() {
      this.searchParams = {};
      this.$emit("onSearchBtnClicked", this.searchParams);
    },
    onSearch() {
      this.$emit("onSearchBtnClicked", this.searchParams);
    },
    onExport() {
      this.$emit("onExportOrder", this.searchParams);
    }
  }
};
</script>

<style scoped lang="scss"></style>
