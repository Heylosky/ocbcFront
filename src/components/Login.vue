<template>
  <div class="login">
    <input class="txtInput" type="text" v-model="user_name" @keyup="verifyFunc" placeholder="Username">
    <p></p>
    <input class="txtInput" type="password" v-model.lazy="password" placeholder="PIN">
    <p class="alert" v-if="ifShow">Username or password is incorrect, please re-enter</p>
    <div class="OTPbutton">
      <button @click="rsaFunc" :class="{verifyBtnDis: this.isDisabled, verifyBtnEnb: !this.isDisabled}" :disabled="isDisabled">Request OTP</button>
    </div>
  </div>
  <p></p>
  <div class="login" v-show="showVer">
    <input class="txtInput" type="text" v-model="pinCode" @keyup="changeDis" placeholder="Enter 4-digit OTP">
    <p class="alert" v-if="isFail">PIN authentication failed, please re-enter</p>
    <div style="height: 30px" class="OTPbutton">
      <button :class="{verifyBtnDis: this.isDisable, verifyBtnEnb: !this.isDisable}" @click="authFunc" :disabled="isDisable">Verify to login</button>
    </div>
    <span>If you do not receive the SMS OTP in {{timerCount}} seconds, click <span id="resend" @click="resendOtp">here</span> to resend SMS OTP.</span>
  </div>
  <div class="err" v-if="isErr">
    <p>System network failure, please contact operation team!</p>
  </div>
</template>

<script>
import {requestGet2, requestPost} from "@/network/request";
import {Encode} from "@/network/encrypt";
import axios from "axios";
import {JSEncrypt} from "jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      user_name: '',
      password: '',
      enPassword: '',
      ifShow: false,
      isErr: false,
      isDisabled: true,
      showVer: false,
      timerCount: 30,
      publicKey: '',
      pinCode: '',
      isDisable: true,
      isFail: false,
    }
  },
  methods: {
    LoginFunc() {
      let formData = new FormData()
      console.log(this.user_name);
      formData.append('user_name', this.user_name)
      formData.append('password', this.enPassword)
      requestPost('/admin/login', formData,  {
        headers: {
          "Content-Type": "application/json",
        }
      },res => {
        console.log(res);
        if (res.data.status === "0") {
          this.ifShow = true
        }
        if (res.data.status === "1") {
          this.ifShow = false
          this.isDisabled = true
          this.showVer = true
          this.countDown()
        }
      }, err => {
        this.isErr = true
        console.log(err);
      })

      // const instance1 = axios.create({
      // })
      // instance1.post("http://127.0.0.1:8000/admin/login", formData, {
      //   headers: {}
      // }).then(function(response) {
      //       console.log(response);
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     })

      // axios.defaults.withCredentials = true
      // axios.post("http://127.0.0.1:8000/admin/login", formData, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // }).then(function(response) {
      //   console.log(response);
      //   console.log(document.cookie);
      // }).catch(function (error) {
      //   console.log(error);
      // })
      },
    verifyFunc() {
      const email = /^[.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[.][a-zA-Z0-9_-]?[.a-zA-Z0-9_-]+$/
      this.isDisabled = !email.test(this.user_name);
    },
    rsaFunc() {
      let publicKey
      new Promise((resolve, reject) => {
        requestGet2({
          url: '/bak/rsa'
        }, res => {
          console.log(res.data);
          this.publicKey = res.data;
          resolve();
        }, err => {
          console.log(err);
          resolve();
        })
      }).then(() => {
        this.enPassword = Encode(this.publicKey, this.password);
        this.LoginFunc()
      })
    },
    changeDis() {
      const pin = /^\d{4}$/
      this.isDisable = !pin.test(this.pinCode);
    },
    authFunc() {
      console.log(this.pinCode);
      let formData = new FormData()
      formData.append('otp', this.pinCode)
      requestPost('/admin/auth', formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      }, res => {
        console.log(res);
        if (res.data.status === "0") {
          this.isFail = true
        }
        if (res.data.status === "1") {
          window.sessionStorage.setItem('isAuth', 'true')
          this.$router.push('/people/list')
        }
      }, err => {
        this.isErr = true
        console.log(err);
      })
    },
    countDown() {
      this.timerCount = 30
        let timer = setInterval(() => {
          if(this.timerCount > 0) {
            this.timerCount--
          } else {
            clearInterval(timer)
            timer = null
          }
        },1000)
    },
    resendOtp() {
      this.LoginFunc()
    }
  }
}
</script>

<style scoped>
.login {
  width: 80%;
  margin: auto;
  padding: 5px;
  min-width: 250px;
  text-align: center;
}

.OTPbutton {
  padding: 5px;
  height: 8px;
}
.OTPbutton button{
  width: 50%;
  float: right;
}

.verifyBtnDis {
  font-size: 18px;
}

.verifyBtnEnb {
  font-size: 18px;
  background-color: #C21318;
  color: white;
  border: 1px #C21318 solid;
  border-radius: 2px;
}

.verifyBtnEnb:hover {
  font-size: 18px;
  background-color: red;
  color: white;
  border: 1px #C21318 solid;
  border-radius: 2px;
}

#resend {
  color: blue;
  border-bottom: blue solid 1px;
  cursor: pointer;
}
</style>