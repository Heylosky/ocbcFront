<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2 style="margin: auto">Add a new
          <select name="role" v-model="role">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </h2>
      </div>
      <div class="modal-body">
        <userCreate v-if="role==='User'" ref="child" @saveState="getSaveSta"/>
        <PeopleCreate v-if="role==='Admin'" ref="child" @saveState="getSaveSta"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-close" @click="closeSelf">Cancel</button>
        <button type="button" class="btn-confirm" @click="saveBtn" :disabled="saveState">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import PeopleCreate from "@/components/peopleCreate";
import userCreate from "@/components/userCreate";

export default {
  name: "addModal",
  components: {
    PeopleCreate,
    userCreate
  },
  props:{},
  data() {
    return {
      role: 'User',
      saveState: true
    }
  },
  methods: {
    closeSelf() {
      this.$emit("closeModal");
    },
    saveBtn() {
      this.$refs.child.parentSaveMsg();
      this.$emit("closeModal");
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
.modal-header select {
  font-weight: bold;
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