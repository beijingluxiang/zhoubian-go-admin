<template>
  <div style="height: 300px;">
    <brand-detail :is-edit="true"></brand-detail>
  </div>
</template>
<script>
import BrandDetail from "./components/BrandDetail";
export default {
  name: "updateBrand",
  components: { BrandDetail }
};
</script>
<style></style>
