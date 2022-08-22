<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2 style="margin: auto">Are you sure to delete all information of following people.</h2>
      </div>
      <div class="modal-body">
        <table>
          <thead>
          <th>Email Address</th>
          </thead>
          <tr>
            <td>{{delList}}</td>
          </tr>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-close" @click="closeSelf">Cancel & Close</button>
        <button type="button" class="btn-confirm" @click="saveBtn">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import {requestPost} from "@/network/request";

export default {
  name: "DeleteModal",
  props: ['delList'],
  methods: {
    closeSelf() {
      this.$emit("closeDeleteModal");
    },
    saveBtn() {
      let formData = new FormData()
      formData.append('delList', this.delList)
      requestPost('/people/batch/delete', formData,  {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      },res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
      this.$emit("closeDeleteModal");
      this.$emit("changed");
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