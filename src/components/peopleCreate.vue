<template>
  <div class="peopleInfoList">
    <table class="infoList">
      <thead>
      <th colspan="2" style="text-align: center">Enter new Admin information</th>
      <tr>
        <th>Items</th>
        <th>Values</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><label for="email">Email</label></td>
        <td>
          <input class="addInput" type="text" id="email" v-model.lazy="person.contactInformation.email[0].address" @focusout="emailFmtChk">
          <p v-show="emailFmtErr">
            <span class="alert">Incorrect email format, please re-enter</span>
          </p>
          <p v-show="emailInUsed">
            <span class="alert">This email already in used by another person</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="password">Web Password</label></td>
        <td>
          <input class="addInput" type="password" id="password" v-model.lazy="person.customAttributes.webPassword" @focusout="pwdFmt"><br>
          <span style="font-size: 5px">password must contain at least 7 character, and include 1<br>special characters from below: !@#$%^&*</span>
          <p v-show="pwdFmtErr">
            <span class="alert">Unmeet safety rules, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="firstName">First Name</label></td>
        <td>
          <input class="addInput" type="text" id="firstName" v-model.lazy="person.firstName" @focusout="fNameFmt">
          <p v-show="fNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="lastName">Last Name</label></td>
        <td>
          <input class="addInput" type="text" id="lastName" v-model.lazy="person.lastName" @focusout="lNameFmt">
          <p v-show="lNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="phone">Phone Number</label></td>
        <td>
          <input class="addInput" type="text" id="phone" v-model.lazy="person.contactInformation.phone[0].number" placeholder="please add country code, eg.65xxxxxxxx" @focusout="phoneFmt">
          <p v-if="phoneFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Host Access Code</td>
        <td>
          <input class="addInput" type="text" id="hostAccessCode" v-model.lazy="person.customAttributes.hostAccessCode" @focusout="hostACFmt">
          <p v-if="hostACFmtErr">
            <span class="alert">Code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Attendee Access Code</td>
        <td>
          <input class="addInput" type="text" id="attendeeAccessCode" v-model.lazy="person.customAttributes.attendeeAccessCode" @focusout="attendeeACFmt">
          <p v-if="attendeeACFmtErr">
            <span class="alert">Code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Host PIN</td>
        <td>
          <input class="addInput" type="text" id="hostPIN" v-model.lazy="person.customAttributes.hostPIN" @focusout="hostPINFmt">
          <p v-if="hostPINFmtErr">
            <span class="alert">PIN code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Audio PIN</td>
        <td>
          <input class="addInput" type="text" id="audioPIN" v-model.lazy="person.customAttributes.audioPIN" @focusout="audioPINFmt">
          <p v-if="audioPINFmtErr">
            <span class="alert">PIN code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Meeting ID</td>
        <td>
          <input class="addInput" type="text" id="meetingID" v-model.lazy="person.customAttributes.meetingID" @focusout=meetingIDFmt>
          <p v-if="meetingIDFmtErr">
            <span class="alert">ID must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>IVR Password</td>
        <td>
          <input class="addInput" type="text" id="ivrPassword" v-model.lazy="person.customAttributes.ivrPassword" @focusout=ivrPwdFmt>
          <p v-if="ivrPwdFmtErr">
            <span class="alert">ID must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Groups</td>
        <td>
          <ul>
            <li hidden><input type="checkbox" value="Admin" v-model="person.tags" checked="checked">Admin</li>
            <li><input type="checkbox" value="TCC_Internal_Group" v-model="person.tags">TCC Internal Group</li>
            <li><input type="checkbox" value="RTB_Management_Group" v-model="person.tags">RTB Management Group</li>
            <li><input type="checkbox" value="Key_Functions_Group" v-model="person.tags">Key Function Group</li>
          </ul>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {requestGet2, requestPost} from "@/network/request";
import {Encode} from "@/network/encrypt";

export default {
  name: "peopleCreate",
  data() {
    return {
      person: {
        firstName: '',
        lastName: '',
        tags: ["Admin"],
        contactInformation: {
          email: [
            {address: ''},
          ],
          phone: [
            {number: ''},
          ]
        },
        customAttributes: {
          webPassword: "",
          hostAccessCode: "",
          attendeeAccessCode: "",
          hostPIN: "",
          audioPIN: "",
          meetingID: "",
          ivrPassword: "",
        }
      },
      publicKey: '',
      emailInUsed: false,
      emailFmtErr: false,
      emailIsNull: true,
      pwdFmtErr: false,
      pwdIsNull: true,
      fNameFmtErr: false,
      fNameIsNull: true,
      lNameFmtErr: false,
      lNameIsNull: true,
      phoneFmtErr: false,
      phoneIsNull: true,
      hostACFmtErr: false,
      hostACIsNull: true,
      attendeeACFmtErr: false,
      attendeeACIsNull: true,
      hostPINFmtErr: false,
      hostPINIsNull: true,
      audioPINFmtErr: false,
      audioPINIsNull: true,
      meetingIDFmtErr: false,
      meetingIDIsNull: true,
      ivrPwdFmtErr: false,
      ivrPwdIsNull: true,
    }
  },
  computed: {
    saveState() {
      let arr = [this.emailInUsed, this.emailFmtErr, this.emailIsNull, this.pwdFmtErr, this.pwdIsNull, this.fNameFmtErr,
        this.fNameIsNull, this.lNameFmtErr, this.lNameIsNull, this.phoneFmtErr, this.phoneIsNull, this.hostACFmtErr,
      this.hostACIsNull, this.attendeeACFmtErr, this.attendeeACIsNull, this.hostPINFmtErr, this.hostPINIsNull, this.audioPINFmtErr,
      this.audioPINIsNull, this.meetingIDFmtErr, this.meetingIDIsNull, this.ivrPwdFmtErr, this.ivrPwdIsNull]
      return arr.some(x => x)
    }
  },
  methods: {
    emailFmtChk() {
      this.emailIsNull = false
      const email = /^[.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[.][a-zA-Z0-9_-]?[.a-zA-Z0-9_-]+$/
      if (email.test(this.person.contactInformation.email[0].address)) {
        this.emailFmtErr = false
        this.checkBtn()
      } else {
        this.emailFmtErr = true
        this.emailInUsed = false
        this.$emit("saveState", this.saveState)
      }
    },
    checkBtn() {
      let formData = new FormData()
      formData.append('email', this.person.contactInformation.email[0].address)
      requestPost('/people/person/verify/email', formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      }, res => {
        console.log(res);
        if (res.data.isApproved) {
          this.emailInUsed = false
          this.$emit("saveState", this.saveState)
        } else {
          this.emailInUsed = true
          this.$emit("saveState", this.saveState)
        }
      }, err => {
        console.log(err);
        this.emailInUsed = true
        this.$emit("saveState", this.saveState)
      })
    },
    fNameFmt() {
      this.fNameIsNull = false
      const name = /^[a-zA-Z]+$/
      if (name.test(this.person.firstName)) {
        this.fNameFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.fNameFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    lNameFmt() {
      this.lNameIsNull = false
      const name = /^[a-zA-Z]+$/
      if (name.test(this.person.lastName)) {
        this.lNameFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.lNameFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    pwdFmt() {
      this.pwdIsNull = false
      const pwd = /^(?=.*[0-9a-zA-Z])(?=.*[!@#$%^&*])(.{7,})$/
      if (pwd.test(this.person.customAttributes.webPassword)) {
        this.pwdFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.pwdFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    phoneFmt() {
      this.phoneIsNull = false
      const phone = /^[0-9]+$/
      if (phone.test(this.person.contactInformation.phone[0].number)) {
        this.phoneFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.phoneFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    hostACFmt() {
      this.hostACIsNull = false
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.hostAccessCode)) {
        this.hostACFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.hostACFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    attendeeACFmt() {
      this.attendeeACIsNull = false
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.attendeeAccessCode)) {
        this.attendeeACFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.attendeeACFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    hostPINFmt() {
      this.hostPINIsNull = false
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.hostPIN)) {
        this.hostPINFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.hostPINFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    audioPINFmt() {
      this.audioPINIsNull = false
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.audioPIN)) {
        this.audioPINFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.audioPINFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    meetingIDFmt() {
      this.meetingIDIsNull = false
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.meetingID)) {
        this.meetingIDFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.meetingIDFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    ivrPwdFmt() {
      this.ivrPwdIsNull = false
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.ivrPassword)) {
        this.ivrPwdFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.ivrPwdFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    SaveMsg() {
      let formData = new FormData()
      console.log(JSON.stringify(this.person))
      formData.append('person', JSON.stringify(this.person))
      requestPost('/people/create', formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      },res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    },
    parentSaveMsg() {
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
        this.person.customAttributes.webPassword = Encode(this.publicKey, this.person.customAttributes.webPassword);
        this.SaveMsg()
      })
    },
  }
}
</script>

<style scoped>
table {
  border: 1px black solid;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: #FAFCFC;
}

th, td {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}

th {
  background-color: #667C88;
  color: white;
  font-weight: 600;
}

.addInput {
  min-width: 300px;
}

.peopleInfoList{
  padding: 5px;
}

.infoList {
  margin: auto;
  min-width: 60%;
}
</style>