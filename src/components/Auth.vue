<template>
  <div class="inforHead">
    <div class="information">
      <div class="authImg">
        <img class="orangeLogo" src="../assets/img/manWithTick.png" alt="Ticket">
      </div>
      <p>
        <span>We sent a PIN to a phone number ending in <strong>{{phoneNumber}}</strong>.</span>
      </p>
    </div>
  </div>

  <div class="authBlock">
    <p>PIN: <input type="text" v-model="pinCode" @keyup="changeDis" placeholder="Enter 4-digit PIN"></p>
    <p class="alert" v-if="isFail">用户名或密码错误，请重新输入</p>
    <button :class="{verifyBtnDis: isDisable, verifyBtnEnb: !isDisable}" @click="authFunc" :disabled="isDisable">VERIFY</button>
  </div>

  <div class="err" v-if="isErr">
    <p>系统网络故障，请联系运维团队处理!</p>
  </div>
</template>

<script>
import {requestPost} from "@/network/request";
import axios from "axios";

export default {
  name: "Auth",
  data() {
    return {
      pinCode: '',
      phoneNumber: '{Unknow_err}',
      isDisable: true,
      isFail: false,
      isErr: false,
    }
  },
  methods: {
    changeDis() {
      const pin = /^\d{4}$/
      if (pin.test(this.pinCode)) {
        this.isDisable = false
      } else {
        this.isDisable = true
      }
    },
    authFunc() {
      console.log(this.pinCode);
      let formData = new FormData()
      formData.append('otp', this.pinCode)
      requestPost('/admin/auth', formData,  {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      },res => {
        console.log(res);
        if (res.data.status === "0") {
          this.isFail = true
        }
        if (res.data.status === "1") {
          this.$router.push('/admin/info')
        }
      }, err => {
        this.isErr = true
        console.log(err);
      })

      // document.cookie = "mycookiesessionnameid=21111b5f-84e2-498a-ae44-2ca7af6d1f12"
      // const instance1 = axios.create({
      // })
      // instance1.post("http://127.0.0.1:8000/admin/auth", formData, {
      //   // withCredentials: true
      // }).then(function(response) {
      //       console.log(response);
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     })
    }
  }
}
</script>

<style scoped>
.inforHead{
  height: 100px;
  position: relative;
  padding: 5px;
}

.information {
  background-color: white;
  width: 50%;
  height: 50px;
  border: 1px #ff6600 solid;
  padding: 2px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  vertical-align: middle;
  horiz-align: center;
}

.authImg {
  height: 50px;
  width: 50px;
  float: left;
}

.authBlock {
  background-color: white;
  border: 2px black solid;
  height: 50%;
  width: 50%;
  margin: auto;
  padding: 2px;
}

.verifyBtnDis {
  font-size: 18px;
  width: 250px;
}

.verifyBtnEnb {
  font-size: 18px;
  width: 250px;
  background-color: #595959;
  color: white;
  border: 1px #8F8F8F solid;
}
</style>