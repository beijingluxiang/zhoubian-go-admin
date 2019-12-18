<template>
  <div style="height: 400px;">
    <product-cate-detail :is-edit="false"></product-cate-detail>
  </div>
</template>
<script>
import ProductCateDetail from "./components/ProductCateDetail";
export default {
  name: "addProductCate",
  components: { ProductCateDetail }
};
</script>
<style></style>
