<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2 style="margin: auto">Assign
        </h2>
      </div>
      <div class="modal-body">
        <p>Please choose meeting groups to assign to the selected users:</p>
        <ul>
          <li><input type="checkbox" value="TCC_Internal_Group" v-model="csGp"> TCC Internal group</li>
          <li><input type="checkbox" value="RTB_Management_Group" v-model="csGp"> RTB Management group</li>
          <li><input type="checkbox" value="Key_Functions_Group" v-model="csGp"> Key Functions group</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-close" @click="closeSelf">Cancel & Close</button>
        <button type="button" class="btn-confirm" @click="saveBtn">SAVE & Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import {requestPost} from "@/network/request";

export default {
  name: "gpAssignModal",
  props: ['assignList'],
  data() {
    return {
      csGp: []
    }
  },
  methods: {
    closeSelf() {
      this.$emit("closeGpAssign");
    },
    saveBtn() {
      let formData = new FormData();
      formData.append('assignList', this.assignList)
      formData.append('tags', this.csGp)
      requestPost('/people/tags/assign', formData,  {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      },res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
      this.$emit('closeGpAssign')
    }
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
</style>