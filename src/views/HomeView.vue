<template>
  <div id="login_page">
    <div class="welcomeBlock">
      <div class="welcomeImgBlock">
        <img alt="OCBC logo" id="ocbc_logo" src="../assets/img/OCBC-Bank-Logo-500x281.png">
      </div>
      <hr>
      <div class="welcomeTextBlock">
        <p>
          <span>Emergency Meeting User Management</span>
        </p>
      </div>
      <Login/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login";

export default {
  name: 'HomeView',
  components: {
    Login
  }
}
</script>

<style>
#login_page {
  background: url("../assets/img/U307388_medium.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: cover;
}

.welcomeBlock {
  position: absolute;
  min-width: 400px;
  max-width: 400px;
  padding: 10px;
  top: 50%;
  left: 60%;
  -webkit-transform: translate(-0%, -50%);
  -moz-transform: translate(-10%, -50%);
  -ms-transform: translate(-10%, -50%);
  -o-transform: translate(-10%, -50%);
  transform: translate(-10%, -50%);
  background-color: rgba(255,255,255,0.9);
}

.welcomeImgBlock {
  width: 50%;
  margin: auto;
}

#ocbc_logo {
  width: 100%;
}

.welcomeTextBlock{
  margin: auto;
  color: black;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}
</style>