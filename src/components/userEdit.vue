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
          <input type="text" v-model.lazy="person.firstName" @focusout="fNameFmt">
          <p v-show="fNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Last Name</td>
        <td>
          <input type="text" v-model="person.lastName" @focusout="lNameFmt">
          <p v-show="lNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Groups</td>
        <td>
          <ul>
            <li hidden><input type="checkbox" value="User" v-model="person.tags" checked="checked" disabled>User</li>
            <li><input type="checkbox" value="TCC_Internal_Group" v-model="person.tags">TCC Internal Group</li>
            <li><input type="checkbox" value="RTB_Management_Group" v-model="person.tags">RTB Management Group</li>
            <li><input type="checkbox" value="Key_Functions_Group" v-model="person.tags">Key Function Group</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Phone Number</td>
        <td>
          <input type="text" v-model="person.contactInformation.phone[0].number" @focusout="phoneFmt">
          <p v-if="phoneFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Email Address</td>
        <td><input type="text" v-model="person.contactInformation.email[0].address" disabled></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {requestGet2, requestPost} from "@/network/request";
import {Encode} from "@/network/encrypt";

export default {
  name: "userEdit",
  props: ['person'],
  data() {
    return {
      fNameFmtErr: false,
      lNameFmtErr: false,
      phoneFmtErr: false,
      needReset: true,
    }
  },
  computed: {
    saveState() {
      let arr = [this.fNameFmtErr, this.lNameFmtErr, this.phoneFmtErr]
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
        this.$emit("saveState", this.saveState)
      } else {
        this.phoneFmtErr = true
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
    }
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

.peopleInfoList{
  padding: 5px;
}

.infoList {
  margin: auto;
  min-width: 60%;
}
</style>