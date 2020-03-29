<template>
  <scroll-bar>
    <div
      v-if="!isCollapse"
      style="padding: 5px; color: #9eb5cc; font-size: 20px; text-align: center; background: #333333;"
    >
      <div
        style="border: 1px solid rgba(255,255,255,.2); padding: 20px 0; border-radius: 10px;"
      >
        周边-GO后台
      </div>
    </div>
    <el-menu
      :show-timeout="500"
      :default-openeds="defaultOpen"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      default-active="1"
      :collapse="isCollapse"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      isCollapse: false,
      defaultOpen: ["1", "2", "3", "4"]
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    }
  }
};
</script>
