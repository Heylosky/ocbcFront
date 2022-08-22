<template>
  <div class="logout_div">
    <span class="logoutInfo">
      You have successful logout. Return to login page after {{timer}} seconds.<br>
      If not return automatically, please click <a href="/#/">here.</a>
    </span>
  </div>
</template>

<script>
export default {
  name: "Logout",
  data() {
    return {
      timer: 10,
    }
  },
  mounted() {
    let timer = setInterval(() => {
      if(this.timer > 0) {
        this.timer--
      } else {
        clearInterval(timer)
        timer = null
        this.$router.push("/")
      }
    },1000)
  }
}
</script>

<style scoped>
.logout_div {
  margin: auto;
  text-align: center;
}

.logoutInfo {
  font-size: 20px;
}
</style>