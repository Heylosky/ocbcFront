<template>
  <div class="auth">
    <Auth></Auth>
  </div>
</template>

<script>
import Auth from "@/components/Auth";

export default {
  name: "AuthView",
  components: {Auth}
}
</script>

<style scoped>

.auth {
  padding: 0px;
  max-width: 1100px;
  margin: auto;
}

</style>