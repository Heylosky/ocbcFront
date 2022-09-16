<template>
  <div class="peopleInfoList">
    <table class="infoList">
      <thead>
      <th colspan="2" style="text-align: center">
        Person information details
      </th>
      </thead>
      <tbody>
      <tr>
        <td>First Name</td>
        <td>
          <input type="text" class="editInput" v-model="person.firstName" @focusout="fNameFmt">
          <p v-show="fNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Last Name</td>
        <td>
          <input type="text" class="editInput" v-model="person.lastName" @focusout="lNameFmt">
          <p v-show="lNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Groups</td>
        <td>
          <ul>
            <li hidden><input type="checkbox" value="Admin" v-model="person.tags" checked="checked" disabled>Admin</li>
            <li><input type="checkbox" value="TCC_Internal_Group" v-model="person.tags">TCC Internal Group</li>
            <li><input type="checkbox" value="RTB_Management_Group" v-model="person.tags">RTB Management Group</li>
            <li><input type="checkbox" value="Key_Functions_Group" v-model="person.tags">Key Function Group</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Phone Number</td>
        <td>
          <input type="text" class="editInput" v-model="person.contactInformation.phone[0].number" @focusout="phoneFmt">
          <p v-if="phoneFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
          <p v-show="phoneInUsed">
            <span class="alert">This number already in used by another person</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Email Address</td>
        <td>
          <input type="text" class="editInput" v-model="person.contactInformation.email[0].address" disabled><br>
          <span style="font-size: 2px">Email is used as a unique identifier, so you can't change.<br>Please delete and recreate this person if needed.</span>
        </td>
      </tr>
      <tr>
        <td>Web PIN</td>
        <td>
          <input type="password" class="editInput" v-model.lazy="person.customAttributes.webPassword" :disabled="needReset" @focusout="pwdFmt"><br>
          <span style="font-size: 2px" v-if="needReset">Raw passwords are encrypted, so there is no way to see<br> this user's password.<br>
            You can reset the password by click<span @click="resetPwd" id="resetPwd"> here.</span>
          </span>
          <div v-if="!needReset">
            <span style="font-size: 5px">password must contain at least 7 character, and include 1<br>special characters from below: !@#$%^&*</span>
            <p v-show="pwdFmtErr">
              <span class="alert">Unmeet safety rules, please re-enter</span>
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td>Host Access Code</td>
        <td>
          <input type="text" class="editInput" v-model.lazy="person.customAttributes.hostAccessCode" @focusout="hostACFmt">
          <p v-if="hostACFmtErr">
            <span class="alert">Code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Attendee Access Code</td>
        <td>
          <input type="text" class="editInput" v-model.lazy="person.customAttributes.attendeeAccessCode" @focusout="attendeeACFmt">
          <p v-if="attendeeACFmtErr">
            <span class="alert">Code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Host PIN</td>
        <td>
          <input type="text" class="editInput" v-model.lazy="person.customAttributes.hostPIN" @focusout="hostPINFmt">
          <p v-if="hostPINFmtErr">
            <span class="alert">PIN code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Audio PIN</td>
        <td>
          <input type="text" class="editInput" v-model.lazy="person.customAttributes.audioPIN" @focusout="audioPINFmt">
          <p v-if="audioPINFmtErr">
            <span class="alert">PIN code must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Meeting ID</td>
        <td>
          <input type="text" class="editInput" v-model.lazy="person.customAttributes.meetingID" @focusout=meetingIDFmt>
          <p v-if="meetingIDFmtErr">
            <span class="alert">ID must be Number, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>IVR Password</td>
        <td>
          <input type="text" class="editInput" id="ivrPassword" v-model.lazy="person.customAttributes.ivrPassword" @focusout=ivrPwdFmt>
          <p v-if="ivrPwdFmtErr">
            <span class="alert">IVR PIN must be Number, please re-enter</span>
          </p>
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
  name: "adminEdit",
  props: ['person'],
  data() {
    return {
      fNameFmtErr: false,
      lNameFmtErr: false,
      phoneInUsed: false,
      phoneFmtErr: false,
      pwdFmtErr: false,
      needReset: true,
      hostACFmtErr: false,
      attendeeACFmtErr: false,
      hostPINFmtErr: false,
      audioPINFmtErr: false,
      meetingIDFmtErr: false,
      ivrPwdFmtErr: false,
    }
  },
  computed: {
    saveState() {
      let arr = [this.fNameFmtErr, this.lNameFmtErr, this.phoneInUsed, this.phoneFmtErr, this.pwdFmtErr, this.hostACFmtErr,
        this.attendeeACFmtErr, this.hostPINFmtErr, this.audioPINFmtErr, this.meetingIDFmtErr]
      return arr.some(x => x)
    }
  },
  methods: {
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
    phoneFmt() {
      this.phoneIsNull = false
      const phone = /^[0-9]+$/
      if (phone.test(this.person.contactInformation.phone[0].number)) {
        this.phoneFmtErr = false
        this.checkPhone()
      } else {
        this.phoneFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    checkPhone() {
      let formData = new FormData()
      formData.append('phone', this.person.contactInformation.phone[0].number)
      requestPost('/people/person/verify/phone', formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      }, res => {
        console.log(res);
        if (res.data.isApproved) {
          this.phoneInUsed = false
          this.$emit("saveState", this.saveState)
        } else {
          this.phoneInUsed = true
          this.$emit("saveState", this.saveState)
        }
      }, err => {
        console.log(err);
        this.phoneInUsed = true
        this.$emit("saveState", this.saveState)
      })
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
    resetPwd() {
      this.needReset = false
      this.person.customAttributes.webPassword = ""
    },
    hostACFmt() {
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
      const number = /^[0-9]+$/
      if (number.test(this.person.customAttributes.ivrPassword)) {
        this.ivrPwdFmtErr = false
        this.$emit("saveState", this.saveState)
      } else {
        this.ivrPwdFmtErr = true
        this.$emit("saveState", this.saveState)
      }
    },
    save() {
      let formData = new FormData()
      console.log(JSON.stringify(this.person))
      formData.append('person', JSON.stringify(this.person))
      formData.append('pwdChange', !this.needReset)
      requestPost('/people/modify', formData,  {
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
        this.save()
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

.editInput {
  width: 85%;
}

.peopleInfoList{
  padding: 5px;
}

.infoList {
  margin: auto;
  min-width: 60%;
}

#resetPwd {
  color: blue;
  border-bottom: blue solid 1px;
  cursor: pointer;
}
</style>