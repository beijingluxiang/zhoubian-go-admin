import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import VCharts from "v-charts";

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";

import "@/icons"; // icon
import "@/permission"; // permission control
import { formatDate } from "./utils/date.js";

Vue.use(ElementUI, { locale });
Vue.use(VCharts);

Vue.config.productionTip = false;

Vue.filter("formatTime", function(time) {
  if (time == null || time === "") {
    return "";
  }
  let date = new Date(time);
  return formatDate(date, "yyyy-MM-dd hh:mm:ss");
});

Vue.mixin({
  methods: {
    getFromLocalstorage: function(name) {
      const _data = localStorage.getItem(name);
      if (_data) {
        return JSON.parse(_data);
      }
    }
  }
});

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
