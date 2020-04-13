<template>
  <scroll-bar>
    <div v-if="!isCollapse" style="position: relative; height: 50px;">
      <img style="width: 100%;" :src="techGif" />
    </div>
    <el-menu
      :show-timeout="500"
      :default-openeds="defaultOpen"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :default-active="defaultActive"
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
import techGif from "@/assets/images/tech.gif";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      isCollapse: false,
      defaultActive: 1,
      defaultOpen: ["1", "2", "3", "4"],
      techGif
    };
  },
  created() {
    if (getCookie("role") === "1") {
      this.defaultActive = "1";
      this.$router.push({ path: "/" });
    } else {
      this.defaultActive = "8";
      this.$router.push({ path: "/merchant/indexSetting/setting" });
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    }
  }
};
</script>
