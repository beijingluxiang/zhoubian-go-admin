import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
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
        component: () => import("@/views/order/index"),
        meta: { title: "退单管理", icon: "el-icon-money" }
      }
    ]
  },
  {
    path: "/product/manage",
    component: Layout,
    index: "6",
    redirect: "",
    accountType: "merchant",
    children: [
      {
        path: "staff",
        name: "staff",
        component: () => import("@/views/user/index"),
        meta: { title: "员工管理", icon: "el-icon-user" }
      }
    ]
  },
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
        component: () => import("@/views/order/index"),
        meta: { title: "桌台管理", icon: "el-icon-mobile" }
      }
    ]
  },
  {
    path: "/merchant/audit",
    component: Layout,
    index: "8",
    accountType: "maintanence",
    redirect: "",
    children: [
      {
        path: "audit",
        name: "audit",
        component: () => import("@/views/order/index"),
        meta: { title: "商户审核", icon: "el-icon-mobile" }
      }
    ]
  },
  {
    path: "/merchant/info",
    component: Layout,
    index: "9",
    accountType: "maintanence",
    redirect: "",
    children: [
      {
        path: "info",
        name: "info",
        component: () => import("@/views/order/index"),
        meta: { title: "商户信息", icon: "el-icon-mobile" }
      }
    ]
  },
  {
    path: "/merchant/account",
    component: Layout,
    index: "10",
    accountType: "maintanence",
    redirect: "",
    children: [
      {
        path: "account",
        name: "account",
        component: () => import("@/views/order/index"),
        meta: { title: "账号管理", icon: "el-icon-mobile" }
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
