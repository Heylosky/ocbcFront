<template>
  <div id="end_page">
    <div id="endBlock">
      <logout></logout>
    </div>
  </div>
</template>

<script>
import Logout from "@/components/Logout";
export default {
  name: "EndView",
  components: {Logout}
}
</script>

<style scoped>
#end_page {
  background: url("../assets/img/U307388_medium.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: cover;
}

#endBlock {
  position: absolute;
  min-width: 500px;
  background-color: #e9e9e9;
  border: black solid 1px;
  padding: 10px;
  width: 40%;
  top: 20%;
  left: 30%;
}
</style>