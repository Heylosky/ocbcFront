<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2 style="margin: auto">Edit a Person
        </h2>
      </div>
      <div class="modal-body">
        <user-edit v-if="person.tags.includes('User')" :person="person" ref="editChild" @saveState="getSaveSta"></user-edit>
        <admin-edit v-if="person.tags.includes('Admin')" :person="person" ref="editChild" @saveState="getSaveSta"></admin-edit>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-close" @click="closeSelf">Cancel & Close</button>
        <button type="button" class="btn-confirm" @click="saveBtn" :disabled="saveState">SAVE</button>
      </div>
    </div>
  </div>
</template>

<script>
import {requestGet2} from "@/network/request";
import UserEdit from "@/components/userEdit";
import AdminEdit from "@/components/adminEdit";

export default {
  name: "EditModal",
  components: {UserEdit, AdminEdit},
  props: ['email'],
  data() {
    return {
      person: {
        firstName: '',
        lastName: '',
        tags: [],
        contactInformation: {
          email: [
            {address: ''},
          ],
          phone: [
            {number: ''},
          ]
        },
        customAttributes: {
          Group: "Admin",
          webPassword: "",
          hostAccessCode: "",
          attendeeAccessCode: "",
          hostPIN: "",
          audioPIN: "",
          meetingID: "",
        }
      },
      publicKey: '',
      saveState: true
    }
  },
  mounted() {
    requestGet2({
      url: '/people/person/' + this.email
    }, res => {
      console.log(res);
      this.person= res.data.person;
    }, err => {
      console.log(err);
    })
  },
  methods: {
    closeSelf() {
      this.$emit("closeEditModal");
    },
    saveBtn() {
      this.$refs.editChild.parentSaveMsg();
      this.$emit("closeEditModal");
      this.$emit("changed");
    },
    getSaveSta(state) {
      this.saveState = state
    },
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background-color: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x:auto;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 700px;
  max-height: 90%;
}
.modal-header {
  border-bottom: 1px solid #eee;
  color: #313131;
  justify-content: space-between;
  padding: 10px;
  display: flex;
  width: 95%;
  margin: auto;
}
.modal-footer {
  border-top: 1px solid #eee;
  width: 95%;
  justify-content: flex-end;
  padding: 15px;
  display: flex;
}
.modal-body {
  position: relative;
  padding: 10px 10px;
  max-height: 500px;
  display: flex;
  overflow-x: auto;
  flex-direction: column;
}
.btn-close, .btn-confirm {
  border-radius: 8px;
  margin-left:16px;
  border:none;
  cursor: pointer;
  background-color: #C21318;
  color: white;
}
.btn-close:hover, .btn-confirm:hover {
  background: red;
}
.btn-confirm:disabled {
  background: #667C88;
  cursor: default;
}
</style>