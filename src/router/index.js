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
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: { title: "首页", icon: "home" }
      }
    ]
  },
  {
    path: "/order",
    component: Layout,
    redirect: "/order/order",
    name: "order",
    index: "2",
    meta: { title: "订单", icon: "el-icon-goods" },
    children: [
      {
        path: "orderSetting",
        name: "orderSetting",
        index: "2-1",
        component: () => import("@/views/order/order/viewSetting"),
        meta: { title: "页面设置", icon: "el-icon-tickets" }
      },
      {
        path: "order",
        name: "order",
        index: "2-2",
        component: () => import("@/views/order/order/index"),
        meta: { title: "订单管理", icon: "el-icon-tickets" }
      }
    ]
  },
  {
    path: "/product",
    component: Layout,
    redirect: "/product/product",
    alwaysShow: true,
    name: "product",
    index: "3",
    meta: { title: "商品", icon: "el-icon-box" },
    children: [
      {
        path: "addProduct",
        name: "publishProduct",
        index: "3-1",
        component: () => import("@/views/product/product/add"),
        meta: { title: "发布商品", icon: "el-icon-tickets" }
      },
      {
        path: "product",
        name: "onSelling",
        index: "3-2",
        component: () => import("@/views/product/product/index"),
        meta: { title: "已发布的商品", icon: "el-icon-tickets" }
      },
      // {
      //   path: "product",
      //   name: "inStore",
      //   index: "3-3",
      //   component: () => import("@/views/product/product/index"),
      //   meta: { title: "已下架的商品", icon: "el-icon-tickets" }
      // },
      {
        path: "productCate",
        name: "productType",
        index: "3-4",
        component: () => import("@/views/product/productCate/index"),
        meta: { title: "商品分类", icon: "el-icon-tickets" }
      },
      {
        path: "brand",
        name: "brand",
        index: "3-3",
        component: () => import("@/views/product/brand/index"),
        meta: { title: "供应商", icon: "el-icon-tickets" }
      },
      {
        path: "vipProduct",
        name: "freeProduct",
        index: "3-5",
        component: () => import("@/views/product/vipProduct/index"),
        meta: { title: "会员半年免费", icon: "el-icon-tickets" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user/order",
    name: "user",
    index: "4",
    meta: { title: "用户", icon: "el-icon-user" },
    children: [
      {
        path: "order",
        name: "userManagement",
        index: "4-1",
        component: () => import("@/views/user/order/index"),
        meta: { title: "用户管理", icon: "el-icon-tickets" }
      },
      {
        path: "orderSetting",
        name: "vipShareSetting",
        index: "4-2",
        component: () => import("@/views/user/order/setting"),
        meta: { title: "会员分佣设置", icon: "el-icon-tickets" }
      }
    ]
  },
  // {
  //   path: "/finacial",
  //   component: Layout,
  //   redirect: "/finacial/order",
  //   name: "finacial",
  //   index: "5",
  //   meta: { title: "财务", icon: "el-icon-data-line" },
  //   children: [
  //     {
  //       path: "order",
  //       name: "finacial",
  //       index: "5-1",
  //       component: () => import("@/views/finacial/order/index"),
  //       meta: { title: "财务概况", icon: "el-icon-tickets" }
  //     },
  //     {
  //       path: "orderDetail",
  //       name: "billDetail",
  //       index: "5-2",
  //       component: () => import("@/views/finacial/order/orderDetail"),
  //       meta: { title: "资金明细" },
  //       hidden: true
  //     },
  //     {
  //       path: "deliverOrderList",
  //       name: "vipBill",
  //       index: "5-3",
  //       component: () => import("@/views/finacial/order/deliverOrderList"),
  //       meta: { title: "会员对账" },
  //       hidden: true
  //     },
  //     {
  //       path: "orderSetting",
  //       name: "withdrawSetting",
  //       index: "5-4",
  //       component: () => import("@/views/finacial/order/setting"),
  //       meta: { title: "提现设置", icon: "el-icon-tickets" }
  //     }
  //   ]
  // },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
