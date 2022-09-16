<template>
  <div class="peopleInfoList">
    <table class="infoList">
      <thead>
      <th colspan="2" style="text-align: center">Enter new User information</th>
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
            <span class="alert">email already used by another person, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="firstName">FirstName</label></td>
        <td>
          <input class="addInput" type="text" id="firstName" v-model.lazy="person.firstName" @focusout="fNameFmt">
          <p v-show="fNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="lastName">LastName</label></td>
        <td>
          <input class="addInput" type="text" id="lastName" v-model.lazy="person.lastName" @focusout="lNameFmt">
          <p v-show="lNameFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
        </td>
      </tr>
      <tr>
        <td><label for="phone">PhoneNumber</label></td>
        <td>
          <input class="addInput" type="text" id="phone" v-model.lazy="person.contactInformation.phone[0].number" placeholder="please add country code, eg.65xxxxxxxx" @focusout="phoneFmt">
          <p v-if="phoneFmtErr">
            <span class="alert">Incorrect format, please re-enter</span>
          </p>
          <p v-show="phoneInUsed">
            <span class="alert">This number already in used by another person</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>Groups</td>
        <td>
          <ul>
            <li hidden><input type="checkbox" value="User" v-model="person.tags" checked="checked">User</li>
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
import PeopleGpManage from "@/components/peopleGpManage";

export default {
  name: "userCreate",
  components: {PeopleGpManage},
  data() {
    return {
      person: {
        firstName: '',
        lastName: '',
        tags: ["User"],
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
        }
      },
      emailInUsed: false,
      emailFmtErr: false,
      emailIsNull: true,
      fNameFmtErr: false,
      fNameIsNull: true,
      lNameFmtErr: false,
      lNameIsNull: true,
      phoneInUsed: false,
      phoneFmtErr: false,
      phoneIsNull: true,
    }
  },
  computed: {
    saveState() {
      let arr = [this.emailInUsed, this.emailFmtErr, this.emailIsNull, this.fNameFmtErr, this.fNameIsNull, this.lNameFmtErr, this.lNameIsNull, this.phoneInUsed, this.phoneFmtErr, this.phoneIsNull]
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
        console.log(this.saveState);
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
        this.phoneInUsed = false
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
        let code = ''
        for (let i = 0; i < 6; i ++) {
          let index = Math.floor(Math.random() * 100);
          code += index;
        }
        this.person.customAttributes.webPassword = '%' + code + '%'
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