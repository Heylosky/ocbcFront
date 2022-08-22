<template>
  <div class="peopleInfoList">
    <table class="infoList">
      <thead>
      Person information details
      </thead>
      <tbody>
      <tr>
        <td>FirstName</td>
        <td><input type="text" v-model="person.firstName"></td>
      </tr>
      <tr>
        <td>LastName</td>
        <td><input type="text" v-model="person.lastName"></td>
      </tr>
      <tr>
        <td>PhoneNumber</td>
        <td><input type="text" v-model="person.contactInformation.phone[0].number" :disabled="isDisabled"></td>
      </tr>
      <tr>
        <td>Password</td>
        <td><input type="text" v-model="person.customAttributes.webPassword" disabled></td>
      </tr>
      </tbody>
    </table>
  </div>
  <div>
    <button>Change</button>
    <button @click="saveBtn">SAVE</button>
    <button>Delete</button>
  </div>
</template>

<script>
import {requestGet2, requestPost} from "@/network/request";
import axios from "axios";

export default {
  name: "peopleInfo",
  data() {
    return {
      isDisabled: true,
      person: {
        firstName: '',
        lastName: '',
        contactInformation: {
          email: [
            {address: ''},
          ],
          phone: [
            {number: ''},
          ]
        },
        customAttributes: {
          webPassword: '',
          Group: '',
        }
      }
    }
  },
  mounted() {
    let email = this.$route.params.email
    requestGet2({
      url: '/people/person/' + email
    }, res => {
      console.log(res);
      this.person= res.data.person;
    }, err => {
      console.log(err);
    })
  },
  methods: {
    saveBtn() {
      let formData = new FormData()
      console.log(JSON.stringify(this.person))
      formData.append('person', JSON.stringify(this.person))
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
    }
  }
}
</script>

<style scoped>
table {
  border: 1px black solid;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: lightyellow;
}

th, td {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}

th {
  background-color: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
}

.peopleInfoList{
  padding: 5px;
}

.infoList {
  margin: auto;
}
</style>