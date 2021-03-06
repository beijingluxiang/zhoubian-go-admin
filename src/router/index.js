import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";
import LayoutPhone from "../views/layout/Layout-phone";

export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  { path: "/404", component: () => import("@/views/404"), hidden: true },
  {
    path: "",
    component: Layout,
    index: "1",
    accountType: "merchant",
    redirect: "/setting",
    children: [
      {
        path: "setting",
        name: "setting",
        component: () => import("@/views/store/setting"),
        meta: { title: "店铺设置", icon: "el-icon-monitor" }
      }
    ]
  },
  {
    path: "/product/category",
    component: Layout,
    index: "2",
    accountType: "merchant",
    redirect: "",
    children: [
      {
        path: "category",
        name: "category",
        component: () => import("@/views/category/index"),
        meta: { title: "商品分类", icon: "el-icon-shopping-bag-2" }
      }
    ]
  },
  {
    path: "/product/manage",
    component: Layout,
    index: "3",
    accountType: "merchant",
    redirect: "",
    children: [
      {
        path: "manage",
        name: "manage",
        component: () => import("@/views/product/index"),
        meta: { title: "商品管理", icon: "el-icon-box" }
      }
    ]
  },
  {
    path: "/product/manage",
    component: Layout,
    index: "4",
    accountType: "merchant",
    redirect: "",
    children: [
      {
        path: "order",
        name: "order",
        component: () => import("@/views/order/index"),
        meta: { title: "订单管理", icon: "el-icon-tickets" }
      }
    ]
  },
  {
    path: "/product/manage",
    component: Layout,
    index: "5",
    accountType: "merchant",
    redirect: "",
    children: [
      {
        path: "refund",
        name: "refund",
        component: () => import("@/views/refund/index"),
        meta: { title: "退单管理", icon: "el-icon-money" }
      }
    ]
  },
  // {
  //   path: "/product/manage",
  //   component: Layout,
  //   index: "6",
  //   redirect: "",
  //   accountType: "merchant",
  //   children: [
  //     {
  //       path: "staff",
  //       name: "staff",
  //       component: () => import("@/views/user/index"),
  //       meta: { title: "员工管理", icon: "el-icon-user" }
  //     }
  //   ]
  // },
  {
    path: "/product/table",
    component: Layout,
    index: "7",
    redirect: "",
    accountType: "merchant",
    children: [
      {
        path: "table",
        name: "table",
        component: () => import("@/views/table/index"),
        meta: { title: "桌台管理", icon: "el-icon-mobile" }
      }
    ]
  },
  {
    path: "/merchant/indexSetting",
    component: Layout,
    index: "8",
    accountType: "maintanence",
    redirect: "",
    children: [
      {
        path: "setting",
        name: "setting",
        component: () => import("@/views/index-setting/index"),
        meta: { title: "首页设置", icon: "el-icon-monitor" }
      }
    ]
  },
  {
    path: "/merchant/audit",
    component: Layout,
    index: "9",
    accountType: "maintanence",
    redirect: "",
    children: [
      {
        path: "audit",
        name: "audit",
        component: () => import("@/views/merchant-audit/index"),
        meta: { title: "商户审核", icon: "el-icon-folder-checked" }
      }
    ]
  },
  {
    path: "/merchant/info",
    component: Layout,
    index: "10",
    accountType: "maintanence",
    redirect: "",
    children: [
      {
        path: "info",
        name: "info",
        component: () => import("@/views/merchant-info/index"),
        meta: { title: "商户信息", icon: "el-icon-document" }
      }
    ]
  },
  // {
  //   path: "/merchant/account",
  //   component: Layout,
  //   index: "10",
  //   accountType: "maintanence",
  //   redirect: "",
  //   children: [
  //     {
  //       path: "account",
  //       name: "account",
  //       component: () => import("@/views/merchant-account/index"),
  //       meta: { title: "账号管理", icon: "el-icon-mobile" }
  //     }
  //   ]
  // },
  {
    path: "/merchant/register",
    component: LayoutPhone,
    index: "11",
    accountType: "maintanence",
    redirect: "",
    hidden: true,
    children: [
      {
        path: "register",
        name: "register",
        component: () => import("@/views/register/index"),
        meta: { title: "商户申请", icon: "el-icon-mobile" }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
