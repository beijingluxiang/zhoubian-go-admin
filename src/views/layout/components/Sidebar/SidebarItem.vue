<template>
  <div class="menu-wrapper">
    <template
      v-for="(item, index) in routes"
      v-if="!item.hidden && item.children && item.accountType === accountType"
    >
      <router-link
        v-if="
          hasOneShowingChildren(item.children) &&
            !item.children[0].children &&
            !item.alwaysShow
        "
        :to="item.path + '/' + item.children[0].path"
        :key="item.children[0].name"
      >
        <el-menu-item
          :index="item.index"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <i :class="item.children[0].meta.icon"></i>
          <span
            v-if="item.children[0].meta && item.children[0].meta.title"
            slot="title"
            >{{ item.children[0].meta.title }}</span
          >
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.index" :key="item.name">
        <template slot="title">
          <!-- <svg-icon
            v-if="item.meta && item.meta.icon"
            :icon-class="item.meta.icon"
          ></svg-icon> -->
          <i :class="item.meta.icon"></i>
          <span v-if="item.meta && item.meta.title" slot="title">{{
            item.meta.title
          }}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children && child.children.length > 0"
            :routes="[child]"
            :key="child.path"
          ></sidebar-item>

          <router-link
            v-else
            :to="item.path + '/' + child.path"
            :key="child.name"
          >
            <el-menu-item :index="child.index">
              <i :class="child.meta.icon"></i>
              <span v-if="child.meta && child.meta.title" slot="title">{{
                child.meta.title
              }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (getCookie("role") === "1") {
      this.accountType = "merchant";
    } else {
      this.accountType = "maintanence";
      console.log(getCookie("role"), "hah");
    }
  },
  data: () => {
    return {
      accountType: "merchant" // merchant  maintanence
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

<style lang="scss">
.el-menu-item {
  height: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 40px;
}

.sidebar-container {
  width: 146px;
}
</style>
