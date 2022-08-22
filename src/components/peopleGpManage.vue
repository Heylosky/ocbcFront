<template>
  <div class="searchBlk">
    <input type="text" placeholder="Search by Email" v-model="searchEmail">&nbsp;
    <button class="opBtn" @click="searchBtn"><img src="../assets/img/pic/search_icon.png">Search</button> |
    <button class="opBtn" @click="refreshBtn">Refresh</button>
  </div>
  <div class="listOptions">
    <button class="opBtn" @click="assignBtn"><img src="../assets/img/pic/Picture1.png" alt="add" > Assign</button> |
    <button class="opBtn" @click="unassignBtn"><img src="../assets/img/pic/edit_icon.png" alt="edit" > Unassign</button>
    <div style="float: right">
      <select class="opBtn" name="filter" v-model="filter" @change="filterBtn">
        <option value="" selected disabled style="display: none;">Group Filter</option>
        <option value="" selected>All</option>
        <option value="RTB_Management_Group">RTB Management Group</option>
        <option value="Key_Functions_Group">Key Functions Group</option>
        <option value="TCC_Internal_Group">TCC Internal Group</option>
      </select>&nbsp;
    </div>
  </div>
  <div class="list">
    <table class="mainlist">
      <thead>
      <tr>
        <th>Select</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>RTB Management Group</th>
        <th>Key Functions Group</th>
        <th>TCC Internal Group</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="people in peopleList">
        <td>
          <input type="checkbox" :value="people.contactInformation.email[0].address" v-model="curSelected">
        </td>
        <td>{{people.firstName}}</td>
        <td>{{people.lastName}}</td>
        <td><input type="checkbox" value="RTB_Management_Group" :checked="people.tags.includes('RTB_Management_Group')" v-model="people.tags" @change="isChange2(people.contactInformation.email[0].address, people.tags)"></td>
        <td><input type="checkbox" value="Key_Functions_Group" :checked="people.tags.includes('Key_Functions_Group')" v-model="people.tags" @change="isChange2(people.contactInformation.email[0].address, people.tags)"></td>
        <td><input type="checkbox" value="TCC_Internal_Group" :checked="people.tags.includes('TCC_Internal_Group')" v-model="people.tags" @change="isChange2(people.contactInformation.email[0].address, people.tags)"></td>
      </tr>
      </tbody>
    </table>
    <span v-show="curSelected.length !== 0" style="float: left">currently select {{curSelected.length}} of total n</span>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <!-- 上一页 -->
        <li @click="prePage()" :class="{'disabled':this.params.currentPage === 1}">
          <button style="cursor: pointer;">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        <li :class="{'active': this.params.currentPage === page}" v-for="(page,index) in pages" :key="index" @click="curPage(page)">
          <button style="cursor: pointer;">
            {{page}}
          </button>
        </li>
        <!-- 下一页 -->
        <li :class="{'disabled':this.params.currentPage === params.totalPage}" @click="nextPage()">
          <button style="cursor: pointer;">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
  <gp-assign-modal v-if="showAssign" @closeGpAssign="closeAssign" :assign-list="curSelected"></gp-assign-modal>
  <gp-unassign-modal v-if="showUnassign" @closeGpUnassign="closeUnassign" :unassign-list="curSelected"></gp-unassign-modal>
</template>

<script>
import {requestGet2, requestPost} from "@/network/request";
import GpAssignModal from "@/components/gpAssignModal";
import GpUnassignModal from "@/components/gpUnassignModal";

export default {
  name: "peopleGpManage",
  components: {GpUnassignModal, GpAssignModal},
  data() {
    return {
      peopleList: [],
      curSelected: [],
      searchEmail: "",
      filter: "",
      params: {
        currentPage: 1,
        totalPage: 1,
        totalNumber: 0,
        flag: false,
      },
      hasChange: [],
      updateList: [],
      showAssign: false,
      showUnassign: false,
    }
  },
  computed: {
    pages() {
      let totalPage = this.params.totalPage
      let currentPage = this.params.currentPage
      //总页数小于10页
      if(totalPage < 10) return totalPage
      //总页数大于10页
      if(currentPage <= 5) {  //选择前5页时
        return [1,2,3,4,5,6,'...',totalPage]
      } else if (currentPage >= totalPage - 5) {  //选择后5页时
        return [1,'...',totalPage-5,totalPage-4,totalPage-3,totalPage-2,totalPage-1,totalPage]
      } else {
        return [1,'...',currentPage-1,currentPage,currentPage+1,currentPage+2,currentPage+3,'...',totalPage]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    isChange2(email, tags) {
      if (this.hasChange.includes(email)) {
        this.updateList.forEach(item => {
          if (item.query.email === email) {
            item.update.tags = tags
          }
        })
      } else {
        this.updateList.push({"query": {"email":email}, "update": {"tags": tags}})
        this.hasChange.push(email);
      }
      console.log(this.updateList);
    },
    saveGpChange() {
      let formData = new FormData()
      console.log(this.hasChange);
      formData.append('hasChange', this.hasChange)
      formData.append('updateList', JSON.stringify(this.updateList))
      requestPost('/people/batch/update/tags', formData,  {
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
    searchBtn() {
      if (this.searchEmail === "") {
        this.getData()
      } else {
        requestGet2({
          url: '/people/person/' + this.searchEmail
        }, res => {
          console.log(res);
          if (res.data.status === 1) {
            this.peopleList = []
            this.peopleList[0] = res.data.person;
            this.params.totalPage = 1
          } else if (res.data.status === 2) {
            window.alert("No person found")
          } else if (res.data.status === 0) {
            window.alert("You are not login")
          } else {
            window.alert("Serve Internal error")
          }
        }, err => {
          console.log(err);
        })
      }
    },
    refreshBtn() {
      this.getData()
    },
    filterBtn() {
      this.params.currentPage = 1
      this.getData()
    },
    assignBtn() {
      if (this.curSelected.length >= 1) {
        this.showAssign = true
      } else {
        window.alert("Please select at least one person")
      }
    },
    closeAssign() {
      this.showAssign = false;
    },
    unassignBtn() {
      if (this.curSelected.length >= 1) {
        this.showUnassign = true
      } else {
        window.alert("Please select at least one person")
      }
    },
    closeUnassign() {
      this.showUnassign = false
    },
    getData() {
      if (this.params.flag) return;
      this.params.flag = true;
      //请求此页的数据
      console.log(this.params.currentPage);
      let formData = new FormData();
      formData.append('page', this.params.currentPage)
      formData.append('role', this.filter)
      requestPost('/people/list', formData,  {
        headers: {
          "Content-Type": "application/json",
        }
      },res => {
        console.log(res);
        this.peopleList = res.data.peoplelist.persons;
        this.params.totalPage = Math.ceil(res.data.peoplelist.totalCount / res.data.peoplelist.limit)
      }, err => {
        console.log(err);
      })
      this.params.flag = false
    },
    curPage(page) {
      if(page === '...') return;
      if(this.params.flag) return;
      this.params.currentPage = page;
      this.getData()
    },
    prePage() {
      if(this.params.currentPage > 1) {
        if(this.params.flag) return;
        --this.params.currentPage;
        this.getData()
      }
    },
    nextPage() {
      if(this.params.flag) return;
      if(this.params.currentPage < this.params.totalPage) {
        ++this.params.currentPage;
        this.getData()
      }
    }
  },
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

.list{
  padding: 5px;
}

.mainlist {
  width: 100%;
  margin: auto;
}

.listOptions {
  padding: 4px;
  width: 99%;
  margin: auto;
}

.searchBlk {
  padding: 5px;
  max-width: 98%;
}

.opBtn {
  height: 30px;
  background-color: #C21318;
  border: #C21318 solid;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  vertical-align: middle;
  line-height: 22px;
  cursor: pointer;
}

.opBtn:hover {
  background: red;
}

.opBtn img{
  width: 20px;
  height: 20px;
}

.opBtn option {
  font-size: 18px;
}

nav {
  text-align: center;
  list-style: none;
}

ul {
  width: 50%;
  margin: 0 auto;
}

nav li {
  display: inline-block;
  margin-right: 10px;
}

nav a {
  color: black;
  font-size: 14px;
  border: mediumvioletred 1px solid;
  border-radius: 5px;
  display: block;
  text-align:center;
  text-decoration: none;
  padding: 3px 8px;
  background: lightskyblue;
}

nav a:hover {
  background-color: darkorange;
}

nav button {
  border-radius: 2px;
  border: black 1px solid;
}

.disabled {
  display: none;
}

.active button{
  background-color: #ff6600;
}
</style>