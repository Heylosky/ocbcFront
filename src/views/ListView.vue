<template>
  <div class="page_head">
    <img id="OCBC_logo" src="../assets/img/OCBC-Bank-Logo-500x281.png" alt="OCBC_logo" width="200">
    <span class="page_title">Emergency Meeting User Management</span>
  </div>
  <div class="listBlock">
    <people-list ref="list" @openPeopleModal="open" @openGpManage="openGpModal" @openModify="openEditModal" @openDelete="openDeleteModal" @openImport="openImportModal" @refreshed="refreshed" :changeAlt="changeAlt"/>
  </div>
  <div class="optModal">
    <addModal v-if="showAdd" @closeModal="closeAdd" @changed="change"></addModal>
    <edit-modal v-if="showEdit" @closeEditModal="closeEdit" :email="editEmail" @changed="change"></edit-modal>
    <gp-manage-modal v-if="showGpManage" @closeGpManageModal="closeGpModal" @changed="change"></gp-manage-modal>
    <delete-modal v-if="showDelete" @closeDeleteModal="closeDelete" :delList="delEmailList" @changed="change"></delete-modal>
    <import-modal v-if="showImport" @closeImportModal="closeImport" @changed="change"></import-modal>
  </div>
</template>

<script>
import PeopleList from "@/components/peopleList";
import addModal from "@/components/AddModal";
import GpManageModal from "@/components/GpManageModal";
import EditModal from "@/components/EditModal";
import deleteModal from "@/components/DeleteModal"
import ImportModal from "@/components/ImportModal";

export default {
  name: "ListView",
  components: {
    ImportModal,
    EditModal,
    GpManageModal,
    PeopleList,
    addModal,
    deleteModal,
  },
  data() {
    return {
      showAdd: false,
      showGpManage: false,
      showEdit: false,
      editEmail: "",
      showDelete: false,
      delEmailList: [],
      showImport: false,
      changeAlt: false,
    }
  },
  methods: {
    open() {
      this.showAdd = true
    },
    closeAdd() {
      this.showAdd = false
      this.$refs.list.getData()
    },
    change() {
      this.changeAlt = true
      this.$refs.list.curSelected = []
      setTimeout(this.$refs.list.getData, 2000)
    },
    refreshed() {
      this.changeAlt = false
    },
    openGpModal() {
      this.showGpManage = true
    },
    closeGpModal() {
      this.showGpManage = false
      this.$refs.list.getData()
    },
    openEditModal(email) {
      this.editEmail = email;
      this.showEdit = true;
    },
    closeEdit() {
      this.showEdit = false
      this.$refs.list.getData()
    },
    openDeleteModal(emailList) {
      this.delEmailList = emailList
      this.showDelete = true
    },
    closeDelete() {
      this.showDelete = false
      this.$refs.list.getData()
    },
    openImportModal() {
      this.showImport = true
    },
    closeImport() {
      this.showImport = false
      this.$refs.list.getData()
    }
  }
}
</script>

<style scoped>
.page_head {
  max-width: 98%;
  margin: auto;
  height: 80px;
}

.listBlock {
  padding: 0px;
  /*max-width: 1100px;*/
  margin: auto;
}

.logo {
  width: 1100px;
  height: 100px;
  position: relative;
  border: 1px solid #000;
  margin: auto;
}

.logo img {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.logo span{
  display: inline-block;
  width: 50%;
  height: 100%;
}

#OCBC_logo
{
  float: left;
  position: absolute;
  text-align: center;
  margin-top: 10px;
}

.page_title {
  font-weight: bold;
  font-size: 30px;
  margin: auto;
  text-align: center;
  display: block;
  line-height: 70px;
}
</style>