<template>
  <div id="department">
    <div class="handle">
      <el-input :placeholder="$t('department.queryTitle')" v-model="filterText" style="width:320px;"></el-input>
      <el-button type="primary" @click="addOrganize" v-if="!organizeData.length" style="position: absolute;right: 20px;">
        <i class="iconfont well-4g-icon-add" style="margin-right:5px;"></i>
        {{$t('department.addOrganize')}}
      </el-button>
      <el-button type="primary" @click="addBatch" v-else style="position: absolute;right: 20px;">
        <i class="iconfont well-4g-icon-add" style="margin-right:5px;"></i>
        {{$t('common.addBatch')}}
      </el-button>
    </div>
    <el-tree :data="organizeData" node-key="id" highlight-current default-expand-all :expand-on-click-node="false" :props="treeOption" ref="organizeTree" :filter-node-method="filterNode" >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="slot-t-icons">
          <el-button type="text" size="mini" @click="addDepart(node, data)">
            <i class="iconfont well-4g-icon-add"></i>
            {{$t('common.add')}}
          </el-button>
          <el-button type="text" size="mini" @click="editDepart(node, data)">
            <i class="iconfont well-4g-icon-edit"></i>
            {{$t('common.edit')}}
          </el-button>
          <el-button type="text" size="mini" @click="delDepart(node, data)">
            <i class="iconfont well-4g-icon-delete"></i>
            {{$t('common.delete')}}
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :title="handletitle" :visible.sync="handleVisible" width="540px">
      <el-form :model="handleForm" :rules="rules" ref="handleForm" label-width="160px">
        <el-form-item :label="$t('department.departmentNumber')" prop="deptId">
          <el-input v-model="handleForm.deptId" v-if="confirmBool=='3'" :readonly="confirmBool=='3'" ></el-input>
          <el-input v-model="handleForm.deptId" v-else @blur="checkAdpartId" :placeholder="$t('department.departmentNumberTitle')" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('department.departmentName')" prop="deptName">
          <el-input v-model="handleForm.deptName" :placeholder="$t('department.departmentNameTitle')"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('handleForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="handleVisible = false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchVisible" width="1020px" id="batch">
      <el-form label-width="100px">
        <el-row :gutter="30" style="margin-bottom:10px;">
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('department.departmentParent')}}
            <span class="asterisk">*</span>
          </el-col>
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('department.departmentNumber')}}
            <span class="asterisk">*</span>
          </el-col>
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('department.departmentName')}}
            <span class="asterisk">*</span>
          </el-col>
        </el-row>
        <el-row :gutter="30" v-for="(item,index) in batchForm" :key="item.id" style="margin-bottom:10px;">
          <el-col :span="8">
            <el-cascader clearable :placeholder="index==0?$t('department.querySelect'):$t('common.ditto')" :show-all-levels="false" v-model="item.deptParent" :options="cascaderData" filterable change-on-select :props="cascaderOption" style="width:293px;" ></el-cascader>
          </el-col>
          <el-col :span="8">
            <el-input v-model="item.deptId" @blur="checkBatchAdpartId(item.deptId,index)"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="item.deptName"></el-input>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitBatch">{{$t('common.confirm')}}</el-button>
        <el-button @click="batchVisible = false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { storage } from "../../api/storage.js";
let id = 1000;
export default {
  data() {
    return {
      //定义变量点击确认时是判断是新增组织的确认还是新增部门的确认还是编辑部门的确认 //1表示新增组织，2表示新增部门，3表示编辑部门
      confirmBool: 1,
      organizeData: [],
      filterText: "",
      treeOption: {
        children: "childDept",
        label: "deptName",
        id: "deptId"
      },
      cascaderOption: {
        children: "childDept",
        label: "deptName",
        value: "deptId"
      },
      handleVisible: false,
      handletitle: this.$t("department.addOrganize"),
      cascaderData: [],
      handleForm: {
        deptId: "",
        deptName: "",
        deptParent: []
      },
      rules: {
        deptId: [
          {
            required: true,
            message: this.$t("department.departmentNumberTitle"),
            trigger: "change"
          }
        ],
        deptName: [
          {
            required: true,
            message: this.$t("department.departmentNameTitle"),
            trigger: "change"
          }
        ],
        deptParent: [
          {
            required: true,
            message: this.$t("department.departmentParentTitle"),
            trigger: "change"
          }
        ]
      },
      nowNode: {},
      nowData: {},
      batchVisible: false,
      batchForm: [
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        }
      ]
    };
  },
  watch: {
    filterText(val) {
      this.$refs.organizeTree.filter(val);
    }
  },
  compoted: {},
  created() {},
  mounted() {
    this.getDepart();
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        deptId: [
          {
            required: true,
            message: this.$t("department.departmentNumberTitle"),
            trigger: "change"
          }
        ],
        deptName: [
          {
            required: true,
            message: this.$t("department.departmentNameTitle"),
            trigger: "change"
          }
        ],
        deptParent: [
          {
            required: true,
            message: this.$t("department.departmentParentTitle"),
            trigger: "change"
          }
        ]
      };
    });
  },
  methods: {
    addBool(arrData) {
      for (let i = 0; i < arrData.length; i++) {
        const element = arrData[i];
        arrData[i]["handleIcon"] = false;
        if (arrData[i].childDept && arrData[i].childDept.length) {
          this.addBool(arrData[i].childDept);
        }
      }
    },
    delNull(arrData) {
      for (let i = 0; i < arrData.length; i++) {
        const element = arrData[i];
        if (arrData[i].childDept && arrData[i].childDept.length) {
          this.delNull(arrData[i].childDept);
        } else {
          delete arrData[i].childDept;
        }
      }
    },
    //获取部门列表
    getDepart() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/dept/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {}
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.addBool(res.data.data);
            this.cascaderData = [].concat(res.data.data);
            this.$options.methods.delNull(this.cascaderData);
            this.organizeData = [].concat(res.data.data);
            this.$options.methods.addBool(this.organizeData);
          } else if (
            res.data.statusCode == 407 ||
            res.data.statusCode == 402 ||
            res.data.statusCode == 402
          ) {
            this.$router.push({ path: "/login" });
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.logoutTitle")
            });
          }
        })
        .catch(res => {});
    },
    // 验证单个部门编号是否已存在
    checkAdpartId() {
      if(this.handleForm.deptId){
        this.handleForm.deptId = this.handleForm.deptId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.handleForm.deptId) {
        return false;
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/dept/check/" + this.handleForm.deptId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.handleForm.deptId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.handleForm.deptId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("department.checkId")
            });
          } else if (
            res.data.statusCode == 407 ||
            res.data.statusCode == 402 ||
            res.data.statusCode == 402
          ) {
            this.$router.push({ path: "/login" });
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.logoutTitle")
            });
          }
        })
        .catch(res => {});
    },
    //新增组织
    addOrganize() {
      this.confirmBool = 1;
      this.handleVisible = true;
      this.handletitle = this.$t("department.addOrganize");
      this.handleForm.deptId = "";
      this.handleForm.deptName = "";
      this.handleForm.deptParent = [];
      this.nowNode = {};
      this.nowData = {};
    },
    // 新增部门
    addDepart(node, data) {
      this.confirmBool = 2;
      this.handleVisible = true;
      this.handletitle = this.$t("department.addDepart");
      this.handleForm.deptId = "";
      this.handleForm.deptName = "";
      this.handleForm.deptParent = [];
      this.nowNode = node;
      this.nowData = data;
      this.$nextTick(()=>{
        this.$refs.handleForm.clearValidate();
      });
    },
    //编辑组织部门
    editDepart(node, data) {
      this.confirmBool = 3;
      this.handleVisible = true;
      this.handletitle = this.$t("department.editDepart");
      this.handleForm.deptId = data.deptId;
      this.handleForm.deptName = data.deptName;
      this.handleForm.deptParent = [];
      this.nowNode = node;
      this.nowData = data;
    },
    //删除组织部门
    delDepart(node, data) {
      this.$confirm(this.$t("department.deleteTips"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          let delData = {
            deptIds: [node.data.deptId]
          };
          this.$axios({
            method: "delete",
            url: NEW_URL_CONFIG + "/api/dept/delete/" + node.data.deptId,
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization:
                sessionStorage.getItem("loginPrefix") +
                " " +
                sessionStorage.getItem("loginToken")
            },
            data: ''
          })
            .then(res => {
              // console.log(res)
              if (res.data.statusCode == 200) {
                this.getDepart();
                this.handleVisible = false;
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("department.delSuccess")
                });
              } else if (
                res.data.statusCode == 407 ||
                res.data.statusCode == 402 ||
                res.data.statusCode == 402
              ) {
                this.$router.push({ path: "/login" });
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("common.logoutTitle")
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: "info",
            message: this.$t("common.canceledDeletion")
          });
        });
    },
    //弹框确认事件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = {
              'deptName': this.handleForm.deptName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''),
              'deptParent': "0",
              'deptId': this.handleForm.deptId
            };
          switch (this.confirmBool) {
            //新增组织确认
            case 1:
              this.$axios({
                method: "post",
                url: NEW_URL_CONFIG + "/api/dept/add/single",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization:
                    sessionStorage.getItem("loginPrefix") +
                    " " +
                    sessionStorage.getItem("loginToken")
                },
                data: postData
              })
                .then(res => {
                  if (res.data.statusCode == 200) {
                    this.getDepart();
                    this.handleVisible = false;
                    this.$message({
                      showClose: true,
                      duration: 2000,
                      type: "success",
                      message: this.$t("department.addComSuccess")
                    });
                  } else if (
                    res.data.statusCode == 407 ||
                    res.data.statusCode == 402 ||
                    res.data.statusCode == 402
                  ) {
                    this.$router.push({ path: "/login" });
                    this.$message({
                      showClose: true,
                      duration: 2000,
                      type: "warning",
                      message: this.$t("common.logoutTitle")
                    });
                  }
                })
                .catch(res => {});
              break;
            //新增部门确认
            case 2:
              postData["deptParent"] = this.nowNode.data.deptId;
              this.$axios({
                method: "post",
                url: NEW_URL_CONFIG + "/api/dept/add/single",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization:
                    sessionStorage.getItem("loginPrefix") +
                    " " +
                    sessionStorage.getItem("loginToken")
                },
                data: postData
              })
                .then(res => {
                  if (res.data.statusCode == 200) {
                    this.getDepart();
                    this.handleVisible = false;
                    this.$message({
                      showClose: true,
                      duration: 2000,
                      type: "success",
                      message: this.$t("department.addSuccess")
                    });
                  } else if (
                    res.data.statusCode == 407 ||
                    res.data.statusCode == 402 ||
                    res.data.statusCode == 402
                  ) {
                    this.$router.push({ path: "/login" });
                    this.$message({
                      showClose: true,
                      duration: 2000,
                      type: "warning",
                      message: this.$t("common.logoutTitle")
                    });
                  }
                })
                .catch(res => {});
              break;
            //编辑组织部门确认
            default:
              if (this.nowNode.parent.parent) {
                postData["deptParent"] = this.nowNode.parent.data.deptId;
              }
              this.$axios({
                method: "put",
                url: NEW_URL_CONFIG + "/api/dept/edit",
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization:
                    sessionStorage.getItem("loginPrefix") +
                    " " +
                    sessionStorage.getItem("loginToken")
                },
                data: postData
              })
                .then(res => {
                  if (res.data.statusCode == 200) {
                    this.getDepart();
                    this.handleVisible = false;
                    this.$message({
                      showClose: true,
                      duration: 2000,
                      type: "success",
                      message: this.$t("department.editSuccess")
                    });
                  } else if (
                    res.data.statusCode == 407 ||
                    res.data.statusCode == 402 ||
                    res.data.statusCode == 402
                  ) {
                    this.$router.push({ path: "/login" });
                    this.$message({
                      showClose: true,
                      duration: 2000,
                      type: "warning",
                      message: this.$t("common.logoutTitle")
                    });
                  }
                })
                .catch(res => {});
              break;
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    //检索框
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    // 验证多个新增部门编号是否已存在
    checkBatchAdpartId(val, index) {
      this.batchForm[index].deptId = this.batchForm[index].deptId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      if (!this.batchForm[index].deptId) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (ele.deptId) {
          postData.push({
            deptId: ele.deptId
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].deptId == this.batchForm[index].deptId) {
          he++;
        }
      }
      if (he > 1) {
        this.batchForm[index].deptId = "";
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("department.checkId")
        });
        return false;
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/dept/check/" + this.batchForm[index].deptId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchForm[index].deptId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchForm[index].deptId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("department.checkId")
            });
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.logoutTitle")
            });
          }
        })
        .catch(res => {});
    },
    //新增批量修改
    addBatch() {
      this.batchVisible = true;
      this.batchForm = [
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        },
        {
          deptId: "",
          deptName: "",
          deptParent: []
        }
      ];
    },
    //保存批量修改
    submitBatch() {
      let postData = [];
      let postData1 = [];
      let eleDeptParent = "";
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (i == "0") {
          if (
            ele.deptId &&
            ele.deptName &&
            ele.deptParent &&
            ele.deptParent.length
          ) {
            postData.push(ele);
            if (ele.deptParent) {
              eleDeptParent = ele.deptParent;
            }
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("department.departmentParent") +
                this.$t("common.batchLineTitle3") +
                this.$t("department.departmentNumber") +
                this.$t("common.batchLineTitle3") +
                this.$t("department.departmentName") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          }
        } else {
          if (
            (ele.deptName && !ele.deptId) ||
            (!ele.deptName && ele.deptId) ||
            (ele.deptParent && ele.deptParent.length && !ele.deptName) ||
            (ele.deptParent && ele.deptParent.length && !ele.deptId)
          ) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("department.departmentNumber") +
                this.$t("common.batchLineTitle3") +
                this.$t("department.departmentName") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          } else if (!ele.deptName && !ele.deptId && !ele.deptParent.length) {
          } else {
            if (ele.deptParent && ele.deptParent.length) {
              eleDeptParent = ele.deptParent;
            }
            ele.deptParent = eleDeptParent;
            postData.push(ele);
          }
        }
      }
      for (let i = 0; i < postData.length; i++) {
        const ele = postData[i];
        this.$set(postData1, postData1.length, {
          deptId: ele.deptId,
          deptName: ele.deptName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''),
          deptParent: ele.deptParent[ele.deptParent.length - 1]
        });
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/dept/add",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: postData1
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.getDepart();
            this.batchVisible = false;
            this.$message({
              showClose: true,
              duration: 2000,
              type: "success",
              message: this.$t("department.addSuccess")
            });
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.logoutTitle")
            });
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style lang="scss">
#department {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .handle {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding: 10px 10px 20px;
    border-bottom: 1px solid rgb(220, 223, 230);
    margin-bottom: 10px;
    position: relative;
  }
  .el-tree {
    > .el-tree-node {
      margin-bottom: 10px;
    }
    .slot-t-icons {
      display: none;
    }
    .el-tree-node__content {
      height: 32px !important;
      &:hover .slot-t-icons {
        display: inline-block;
      }
    }
  }
}
#batch {
  .el-dialog__body {
    padding: 20px 20px 0px;
    margin: 0px 20px;
  }
  .asterisk {
    color: #f00;
    font-size: 15px;
    text-align: center;
    display: inline-block;
    width: 12px;
    line-height: 21px;
  }
}
</style>
