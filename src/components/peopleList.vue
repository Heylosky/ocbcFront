<template>
  <div class="searchBlk">
    <input type="text" placeholder="Search by Email" v-model="searchEmail">&nbsp;
    <button class="opBtn" @click="searchBtn"><img src="../assets/img/pic/search_icon.png">Search</button> |
    <button class="opBtn" @click="refreshBtn">Refresh</button>
    <div style="float: right">
      Welcome, {{ username }} |
      <button class="opBtn" @click="logoutBtn">Logout</button>
    </div>
  </div>
  <hr>
  <div class="listOptions">
    <button class="opBtn" @click="addBtn"><img src="../assets/img/pic/Picture1.png" alt="add" > New</button> |
    <button class="opBtn" @click="modifyBtn"><img src="../assets/img/pic/edit_icon.png" alt="edit" > Edit</button> |
    <button class="opBtn" @click="deleteBtn"><img src="../assets/img/pic/delete_icon.png" alt="delete" > Delete</button> |
    <button class="opBtn" @click="manageBtn"><img src="../assets/img/pic/manage_icon.png" alt="manage" > Manage Groups</button>
    <div style="float: right">
      <select class="opBtn" name="filter" v-model="filter" @change="filterBtn">
        <option value="" selected disabled style="display: none;">Role Filter</option>
        <option value="">All</option>
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>&nbsp;
      <button class="opBtn" @click="importBtn"><img src="../assets/img/pic/upload_icon.png" alt="import" > Import</button>
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
        <th>Email Address</th>
        <th>Mobile Number</th>
        <th>Role</th>
        <th>Last Modified (UTC)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="people in peopleList">
        <td style="text-align: center">
          <input type="checkbox" :value="people.contactInformation.email[0].address" v-model="curSelected">
        </td>
        <td>{{people.firstName}}</td>
        <td>{{people.lastName}}</td>
<!--        <td><span v-show="people.tags.includes('RTB_Management_Group')">&nbsp;√</span></td>-->
        <td style="text-align: center"><img class="gpCheck" v-show="people.tags.includes('RTB_Management_Group')" src="../assets/img/pic/check.png"></td>
        <td style="text-align: center"><img class="gpCheck" v-show="people.tags.includes('Key_Functions_Group')" src="../assets/img/pic/check.png"></td>
        <td style="text-align: center"><img class="gpCheck" v-show="people.tags.includes('TCC_Internal_Group')" src="../assets/img/pic/check.png"></td>
        <td>{{people.contactInformation.email[0].address}}</td>
        <td><span v-for="phone in people.contactInformation.phone">{{ phone.number }}</span></td>
        <td>
          <span v-if="people.tags.includes('User')">User</span>
          <span v-if="people.tags.includes('Admin')">Admin</span>
        </td>
        <td>{{people.modifiedAt}}</td>
      </tr>
      </tbody>
    </table>
    <span v-show="curSelected.length !== 0" style="float: left">Currently select {{curSelected.length}} of total {{params.totalNumber}}</span>
    <div v-show="true" style="background-color: white; width: 100%; height:10px">
      <div v-show="changeAlt" style="padding: 5px; font-size: 5px; text-align: right; float: right">
        <span style="font-weight: bold"><img src="../assets/img/pic/idea.png" style="float: left; height: 15px">Note: </span>Changes have been on this page, if latest changes are not updated automatically,<br>
        Click "Refresh" to reload to view the latest data.
      </div>
    </div>
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
          <li :class="{'disabled':this.params.currentPage === this.params.totalPage}" @click="nextPage()">
            <button style="cursor: pointer;">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
  </div>
</template>

<script>
import {requestGet2, requestPost} from "@/network/request";

export default {
  name: "peopleList",
  props: {
    changeAlt: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      username: "Unknown",
      filter: "",
      searchEmail: "",
      peopleList: [],
      // selected: "",
      curSelected: [],
      params: {
        currentPage: 1,
        // pageSize: 20,
        totalPage: 1,
        totalNumber: 0,
        flag: false,
      }
    }
  },
  mounted() {
    this.getData();
    requestGet2({
      url: '/admin/info'
    }, res => {
      console.log(res);
      this.username = res.data.username;
    }, err => {
      console.log(err);
    })
  },
  emits: ['openPeopleModal', 'openGpManage', 'openModify', 'openDelete', 'openImport', 'refreshed'],
  methods: {
    /*searchAllBtn() {
      requestGet2({
        url: '/people/list'
      }, res => {
        console.log(res);
        console.log(res.data.peoplelist);
        this.peopleList = res.data.peoplelist.persons;
      }, err => {
        console.log(err);
      })
    },*/
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
      this.$emit("refreshed")
    },
    logoutBtn() {
      requestGet2({
        url: '/admin/logout'
      }, res => {
        console.log(res);
        if (res.data.status === 1) {
          this.$router.push('/logout')
        }
      }, err => {
        console.log(err);
      })
    },
    addBtn() {
      this.$emit("openPeopleModal");
    },
    manageBtn() {
      this.$emit("openGpManage");
    },
    modifyBtn() {
      if (this.curSelected.length === 1) {
        this.$emit("openModify", this.curSelected[0])
      } else if (this.curSelected.length > 1) {
        window.alert("Only one can be selected at a time")
      } else {
        window.alert("Please make your selection at first")
      }
    },
    deleteBtn() {
      if (this.curSelected.length >= 1) {
        this.$emit("openDelete", this.curSelected)
      } else {
        window.alert("Please make your selection at first")
      }
    },
    filterBtn() {
      this.params.currentPage = 1
      this.getData()
    },
    importBtn() {
      this.$emit("openImport");
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
        this.params.totalNumber = res.data.peoplelist.totalCount;
        this.params.totalPage = Math.ceil(res.data.peoplelist.totalCount / res.data.peoplelist.limit);
      }, err => {
        // this.isErr = true
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

.list{
  padding: 5px;
}

.mainlist {
  width: 100%;
  margin: auto;
}

.listOptions {
  padding: 4px;
  max-width: 98%;
  margin: auto;
}

.searchBlk {
  padding: 5px;
  max-width: 98%;
  margin: auto;
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
  padding: 0px;
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

.gpCheck {
  width: 18px;
  height: 18px;
}
</style>