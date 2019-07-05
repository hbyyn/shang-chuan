<template>
  <div id="staff">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="staffQuery">
      <el-form-item :label="$t('staff.departmentId')">
        <el-cascader :placeholder="$t('department.querySelect')" clearable :show-all-levels="false" v-model="dateQuery.departmentId" :options="departmentList" filterable change-on-select :props="cascaderOption"></el-cascader>
      </el-form-item>
      <el-form-item :label="$t('staff.staffName')">
        <el-select v-model="dateQuery.staffName" filterable clearable @focus="getStaffList" :placeholder="$t('common.select')" >
          <el-option v-for="(item,index) in dateQuery.staffList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addStaff">{{$t('common.add')}}</el-button>
        <el-button type="primary" @click="addBatch">{{$t('common.addBatch')}}</el-button>
        <el-button type="danger" @click="delBatch">{{$t('common.deleteBatch')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="staffTable" :data="staffData" border style="width:100%;" size="mini" @selection-change="handleSelection">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="staffNumber" :label="$t('staff.staffNumber')" width="180"></el-table-column>
      <el-table-column prop="staffName" :label="$t('staff.staffName')" width="180"></el-table-column>
      <el-table-column prop="sex" :label="$t('staff.sex')" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex">{{ $t('common.man') }}</span>
          <span v-else>{{ $t('common.woman') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="birthday" :label="$t('staff.birthday')" width="100" align="center"></el-table-column>
      <el-table-column prop="entryday" :label="$t('staff.entryday')" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" :label="$t('common.createTime')" width="100" align="center"></el-table-column>
      <el-table-column prop="departmentId" :label="$t('staff.departmentId')"></el-table-column>
      <el-table-column prop="phone" :label="$t('staff.phone')" width="120"></el-table-column>
      <el-table-column prop="email" :label="$t('staff.email')" width="150"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="staffPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <!-- 单个新增弹窗 -->
    <el-dialog :title="staffVisibleTitle" :visible.sync="staffVisible" width="540px">
      <el-form :model="staffForm" :rules="rules" ref="staffForm" label-width="150px" class="demo-staffForm" >
        <el-form-item :label="$t('staff.staffNumber')" prop="staffNumber">
          <el-input v-model="staffForm.staffNumber" :readonly="staffForm.addEdit" v-if="staffForm.addEdit"></el-input>
          <el-input v-model="staffForm.staffNumber" v-else @blur="checkStaffId" :placeholder="$t('staff.staffNumberTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('staff.staffName')">
          <el-input v-model="staffForm.staffName" :placeholder="$t('staff.staffNameTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('staff.departmentId')" prop="departmentId">
          <el-cascader :placeholder="$t('department.querySelect')" :show-all-levels="false" v-model="staffForm.departmentId" :options="departmentList" filterable change-on-select :props="cascaderOption" style="width:350px;"></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('staff.sex')">
          <el-radio-group v-model="staffForm.sex" size="small">
            <el-radio label="1" border style="margin-right: 0px;">{{$t('common.man')}}</el-radio>
            <el-radio label="0" border style="margin-right: 0px;">{{$t('common.woman')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('staff.birthday')">
          <el-date-picker @change="birthTime" value-format="yyyy/MM/dd" v-model="staffForm.birthday" type="date" :placeholder="$t('staff.birthdayTitle')"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('staff.entryday')">
          <el-date-picker @change="entryTime" value-format="yyyy/MM/dd" v-model="staffForm.entryday" type="date" :placeholder="$t('staff.entrydayTitle')"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('staff.phone')">
          <el-input v-model="staffForm.phone" :placeholder="$t('staff.phoneTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('staff.email')">
          <el-input v-model="staffForm.email" :placeholder="$t('staff.emailTitle')"></el-input>
        </el-form-item>
        <el-form-item v-if="!staffForm.lookEdit" style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('staffForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="staffVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchVisible" width="1024px" id="batch">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="4" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('staff.staffNumber')}}
            <span class="asterisk">*</span>
          </el-col>
          <el-col :span="4" align="center" style="font-size:14px;font-weight:bold;" >{{$t('staff.staffName')}}</el-col>
          <el-col :span="6" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('staff.departmentId')}}
            <span class="asterisk">*</span>
          </el-col>
          <el-col :span="4" align="center" style="font-size:14px;font-weight:bold;" >{{$t('staff.sex')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;" >{{$t('staff.phone')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;" >{{$t('staff.email')}}</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item,index ) in batchForm" :key="item.id" style="margin-bottom:10px;">
          <el-col :span="4">
            <el-input v-model="item.staffNumber" @blur="checkBatchStaffId(item.staffNumber,index)"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="item.staffName" :placeholder="index==0?$t('common.pleaseInput'):$t('common.ditto')"></el-input>
          </el-col>
          <el-col :span="6">
            <el-cascader clearable :placeholder="index==0?$t('department.querySelect'):$t('common.ditto')" :show-all-levels="false" v-model="item.departmentId" :options="departmentList" filterable change-on-select :props="cascaderOption" style="width:240px;" ></el-cascader>
          </el-col>
          <el-col :span="4" align="center">
            <el-radio-group v-model="item.sex" size="small">
              <el-radio label="1" border style="margin-right: 0px;padding: 8px 8px 0px;" >{{$t('common.man')}}</el-radio>
              <el-radio label="0" border style="margin-right: 0px;padding: 8px 8px 0px;" >{{$t('common.woman')}}</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="3">
            <el-input v-model="item.phone"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input v-model="item.email"></el-input>
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
import myValidate from '../../api/myValidate'
export default {
  data() {
    return {
      departmentList: [],
      cascaderOption: {
        children: "childDept",
        label: "deptName",
        value: "deptId"
      },
      dateQuery: {
        departmentId: [],
        staffName: "",
        staffList: []
      },
      staffData: [],
      //选择保存值
      selection: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      staffVisible: false,
      //新增状态下、编辑状态下确定保存的判断依据，true表示新增，false表示编辑
      staffVisibleBool: true,
      staffVisibleTitle: this.$t("common.add"),
      staffForm: {
        staffNumber: "",
        staffName: "",
        sex: "",
        birthday: "",
        entryday: "",
        phone: "",
        email: "",
        departmentId: [],
        //职员信息弹窗的是新增还是查看 false示新增、查看,true表示编辑
        addEdit: false,
        //职员信息弹窗的是新增、编辑还是查看 false示新增、编辑true表示查看
        lookEdit: false
      },
      rules: {
        staffNumber: [
          {
            required: true,
            message: this.$t("staff.staffNumberTitle"),
            trigger: "change"
          }
        ],
        staffName: [
          {
            required: true,
            message: this.$t("staff.staffNameTitle"),
            trigger: "change"
          }
        ],
        sex: [
          {
            required: true,
            message: this.$t("staff.sexTitle"),
            trigger: "change"
          }
        ],
        birthday: [
          {
            required: true,
            message: this.$t("staff.birthdayTitle"),
            trigger: "change"
          }
        ],
        entryday: [
          {
            required: true,
            message: this.$t("staff.entrydayTitle"),
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("staff.phoneTitle"),
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: this.$t("staff.emailTitle"),
            trigger: "change"
          }
        ],
        departmentId: [
          {
            required: true,
            message: this.$t("staff.departmentIdTitle"),
            trigger: ['blur','change']
          }
        ]
      },
      batchVisible: false,
      batchForm: [
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        }
      ]
    };
  },
  methods: {
    birthTime(val) {
      this.staffForm.birthday = val;
    },
    entryTime(val) {
      this.staffForm.entryday = val;
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
    // 验证单个职员编号是否已存在
    checkStaffId() {
      if(this.staffForm.staffNumber){
      this.staffForm.staffNumber = this.staffForm.staffNumber.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.staffForm.staffNumber) {
        return false;
      }
      this.$axios({
        method: "get",
        url:
          NEW_URL_CONFIG + "/api/employee/check/" + this.staffForm.staffNumber,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.staffForm.staffNumber
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.staffForm.staffNumber = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("staff.staffId")
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
    // 验证多个新增职员编号是否已存在
    checkBatchStaffId(val, index) {
      if(this.batchForm[index].staffNumber){
        this.batchForm[index].staffNumber = this.batchForm[index].staffNumber.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.batchForm[index].staffNumber) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (ele.staffNumber) {
          postData.push({
            staffNumber: ele.staffNumber
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].staffNumber == this.batchForm[index].staffNumber) {
          he++;
        }
      }
      if (he > 1) {
        this.batchForm[index].staffNumber = "";
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("devicel.checkUserId")
        });
        return false;
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/employee/check/" + this.batchForm[index].staffNumber,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchForm[index].staffNumber
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchForm[index].staffNumber = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("staff.staffId")
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
    //获取部门
    getDepart() {
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/dept/select/base",
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
            this.departmentList = [].concat(res.data.data);
            this.$options.methods.delNull(this.departmentList);
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
    //获取职员选择下拉框中的数据
    getStaffList() {
      let deptId = "";
      if (this.dateQuery.departmentId.length) {
        deptId = this.dateQuery.departmentId[
          this.dateQuery.departmentId.length - 1
        ];
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/employee/select/base",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          pageIndex: 1,
          pageSize: 99999999,
          deptId: deptId
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.dateQuery.staffList = [];
            res.data.data.resultObjects.forEach((val, index) => {
              this.dateQuery.staffList.push({
                value: val.employeeId,
                label: val.employeeId + " " + val.employeeName
              });
            });
          } else if (res.data.statusCode == 402) {
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
    //获取职员列表数据
    getstaff(pageIndex, pageSize, staffId, deptId) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/employee/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          employeeId: staffId,
          deptId: deptId,
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.staffData = [];
            res.data.data.resultObjects.forEach((val, index) => {
              let birth = "",entry = "";
              if(val.employeeBirthday){
                birth = val.employeeBirthday.split("T")[0]
              };
              if(val.employeeEntryday){
                entry = val.employeeEntryday.split("T")[0]
              };
              this.staffData.push({
                staffNumber: val.employeeId,
                staffName: val.employeeName,
                sex: val.employeeSex,
                birthday: birth,
                entryday: entry,
                createTime: val.employeeCreatetime.split(" ")[0],
                phone: val.employeePhone,
                email: val.employeeEmail,
                departmentId: val.deptId,
                departmentIds: val.deptIds
              });
            });
            this.pageResize();
          } else if (res.data.statusCode == 402) {
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
    //按条件检索职员列表
    onSubmit() {
      this.getstaff(
        1,
        this.pageTotal,
        this.dateQuery.staffName,
        this.dateQuery.departmentId[this.dateQuery.departmentId.length - 1]
      );
    },
    //表格选择事件
    handleSelection(val) {
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push(val[i].staffNumber);
        }
      }
    },
    //新增职员
    addStaff() {
      this.staffVisible = true;
      this.staffVisibleBool = true;
      this.staffVisibleTitle = this.$t("common.add");
      this.staffForm.addEdit = false;
      this.staffForm.lookEdit = false;
      this.staffForm.staffNumber = "";
      this.staffForm.staffName = "";
      this.staffForm.sex = "1";
      this.staffForm.birthday = "";
      this.staffForm.entryday = "";
      this.staffForm.phone = "";
      this.staffForm.email = "";
      this.staffForm.departmentId = [];
      this.$nextTick(()=>{
        this.$refs.staffForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row) {
      this.staffVisible = true;
      this.staffVisibleBool = false;
      this.staffVisibleTitle = this.$t("common.edit");
      this.staffForm.addEdit = true;
      this.staffForm.lookEdit = false;
      this.staffForm.staffNumber = row.staffNumber;
      this.staffForm.staffName = row.staffName;
      if (row.sex) {
        this.staffForm.sex = "1";
      } else {
        this.staffForm.sex = "0";
      }
      this.staffForm.birthday = row.birthday;
      this.staffForm.entryday = row.entryday;
      this.staffForm.phone = row.phone;
      this.staffForm.email = row.email;
      this.staffForm.departmentId = row.departmentIds;
    },
    //查看职员
    handleLook(index, row) {
      this.staffVisible = true;
      this.staffVisibleTitle = this.$t("common.look");
      this.staffForm.addEdit = false;
      this.staffForm.lookEdit = true;
      this.staffForm.staffNumber = row.staffNumber;
      this.staffForm.staffName = row.staffName;
      if (row.sex) {
        this.staffForm.sex = "1";
      } else {
        this.staffForm.sex = "0";
      }
      this.staffForm.birthday = row.birthday;
      this.staffForm.entryday = row.entryday;
      this.staffForm.phone = row.phone;
      this.staffForm.email = row.email;
      this.staffForm.departmentId = row.departmentIds;
    },
    //删除职员
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("staff.staff") +
          this.$t("common.delTitleTips2"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.$axios({
            method: "delete",
            url: NEW_URL_CONFIG + "/api/employee/delete/" + row.staffNumber,
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
              if (res.data.statusCode == 200) {
                if (this.staffData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  this.getstaff(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.staffName,
                    this.dateQuery.departmentId[
                      this.dateQuery.departmentId.length - 1
                    ]
                  );
                } else {
                  this.getstaff(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.staffName,
                    this.dateQuery.departmentId[
                      this.dateQuery.departmentId.length - 1
                    ]
                  );
                }
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.delSuccessTitle")
                });
                // this.getstaff(this.currentPage,this.pageTotal);
              } else if (res.data.statusCode == 402) {
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
            message: $t("common.canceledDeletion")
          });
        });
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      this.getstaff(this.currentPage, this.pageTotal);
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getstaff(this.currentPage, this.pageTotal);
    },
    //新增或者编辑页面的保存事件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let bool = false;
          if(this.staffForm.phone && !myValidate.phone(this.staffForm.phone)){
            this.$message({showClose: true,duration:2000,
              type: 'warning',
              message: this.$t("common.phoneTitle"),
              duration: 2000
            });
            return false
          }
          if (this.staffForm.email && !myValidate.email(this.staffForm.email)) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.emailTitle"),
              duration: 2000
            });
            return false;
          }
          if (parseInt(this.staffForm.sex)) {
            bool = true;
          }
          let employeeName = '';
          let employeePhone = '';
          let employeeEmail = '';
          if(this.staffForm.staffName){
            employeeName = this.staffForm.staffName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          if(this.staffForm.phone){
            employeePhone = this.staffForm.phone.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          if(this.staffForm.email){
            employeeEmail = this.staffForm.email.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          var postData = {
            'employeeId': this.staffForm.staffNumber,
            'employeeName': employeeName,
            'employeeSex': bool,
            'employeeBirthday': this.staffForm.birthday,
            'employeeEntryday': this.staffForm.entryday,
            'employeePhone': employeePhone,
            'employeeEmail': employeeEmail,
            'deptId': this.staffForm.departmentId[
              this.staffForm.departmentId.length - 1
            ]
          };
          if (this.staffVisibleBool) {
            //新增时的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/employee/add/single",
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
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.staffVisible = false;
                  this.getstaff(this.currentPage, this.pageTotal);
                } else if (res.data.statusCode == 402) {
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
          } else {
            //编辑时的保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/employee/edit",
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
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  this.staffVisible = false;
                  this.getstaff(this.currentPage, this.pageTotal);
                } else if (res.data.statusCode == 402) {
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
        } else {
          return false;
        }
      });
    },
    //批量新增
    addBatch() {
      this.batchVisible = true;
      this.batchForm = [
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        },
        {
          staffNumber: "",
          staffName: "",
          sex: "1",
          birthday: "",
          entryday: "",
          phone: "",
          email: "",
          departmentId: []
        }
      ];
    },
    //保存批量修改
    submitBatch() {
      let nowDate = new Date();
      let postData = [];
      let eleStaffName = "";
      let eleDeptId = "";
      let bool = false;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (parseInt(ele.sex)) {
          bool = true;
        }
        if (i == "0") {
          if (ele.staffNumber && ele.departmentId && ele.departmentId.length) {
            if(ele.phone && !myValidate.phone(ele.phone)){
              this.$message({showClose: true,duration:2000,
                type: 'warning',
                message: this.$t("common.phoneTitle"),
                duration: 2000
              });
              return false
            }
            if (ele.email && !myValidate.email(ele.email)) {
              this.$message({
                showClose: true,
                duration: 2000,
                type: "warning",
                message: this.$t("common.emailTitle"),
                duration: 2000
              });
              return false;
            }
            postData.push({
              employeeId: ele.staffNumber,
              employeeName: ele.staffName,
              employeeSex: bool,
              employeeBirthday: '',
              employeeEntryday: '',
              employeePhone: ele.phone,
              employeeEmail: ele.email,
              deptId: ele.departmentId[ele.departmentId.length - 1]
            });
            if (ele.staffName) {
              eleStaffName = ele.staffName;
            }
            if (ele.departmentId && ele.departmentId.length) {
              eleDeptId = ele.departmentId;
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
                this.$t("staff.staffNumber") +
                this.$t("common.batchLineTitle3") +
                this.$t("staff.departmentId") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          }
        } else {
          if (
            (ele.staffName && !ele.staffNumber) ||
            (ele.phone && !ele.staffNumber) ||
            (ele.email && !ele.staffNumber) ||
            (ele.departmentId && ele.departmentId.length && !ele.staffNumber)
          ) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("staff.staffNumber") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          } else if (!ele.staffNumber) {
          } else {
            if (ele.staffName) {
              eleStaffName = ele.staffName;
            }
            if (ele.departmentId && ele.departmentId.length) {
              eleDeptId = ele.departmentId;
            }
            ele.staffName = eleStaffName;
            ele.departmentId = eleDeptId;
            if (ele.email && !/\w+@\w+\.[a-z]+(\.[a-z]+)?/.test(ele.email)) {
              this.$message({
                showClose: true,
                duration: 2000,
                type: "warning",
                message: this.$t("common.emailTitle"),
                duration: 2000
              });
              return false;
            }
            postData.push({
              employeeId: ele.staffNumber,
              employeeName: ele.staffName,
              employeeSex: bool,
              employeeBirthday: '',
              employeeEntryday: '',
              employeePhone: ele.phone,
              employeeEmail: ele.email,
              deptId: ele.departmentId[ele.departmentId.length - 1]
            });
          }
        }
      }
      for (let i = 0; i < postData.length; i++) {
        if(postData[i].employeeName){
          postData[i].employeeName = postData[i].employeeName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
        if(postData[i].employeePhone){
          postData[i].employeePhone = postData[i].employeePhone.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/employee/add",
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
            this.$message({
              showClose: true,
              duration: 2000,
              type: "success",
              message: this.$t("common.addSuccessTitle")
            });
            this.batchVisible = false;
            this.getstaff(this.currentPage, this.pageTotal);
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
    //批量删除
    delBatch() {
      if (this.selection.length) {
        this.$confirm(
          this.$t("common.delTitleTips1") +
            this.$t("staff.staff") +
            this.$t("common.delTitleTips2"),
          this.$t("common.tips"),
          {
            confirmButtonText: this.$t("common.confirm"),
            cancelButtonText: this.$t("common.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            this.$axios({
              method: "delete",
              url: NEW_URL_CONFIG + "/api/employee/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                employeeIds: this.selection
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (
                    this.staffData.length == this.selection.length &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getstaff(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.staffName,
                      this.dateQuery.departmentId[
                        this.dateQuery.departmentId.length - 1
                      ]
                    );
                  } else {
                    this.getstaff(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.staffName,
                      this.dateQuery.departmentId[
                        this.dateQuery.departmentId.length - 1
                      ]
                    );
                  }
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.delSuccessTitle")
                  });
                  // this.getstaff(this.currentPage,this.pageTotal);
                } else if (res.data.statusCode == 402) {
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
              message: $t("common.canceledDeletion")
            });
          });
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("staff.delNullTitle")
        });
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    //适配函数
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var staff = document.getElementById("staff");
        var staffQuery = document.getElementById("staffQuery");
        var staffTable = document.getElementById("staffTable");
        var staffPage = document.getElementById("staffPage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          staffPage.style.width = staffTable.clientWidth - 11 + "px";
          staffPage.style.paddingLeft = "25px";
          staffPage.style.paddingRight = "25px";
          staffPage.style.marginLeft = -staffPage.offsetWidth / 2 + "px";
          staffPage.style.position = "fixed";
          this.active = true;
        } else {
          staffPage.style.paddingLeft = "5px";
          staffPage.style.position = "static";
          staffPage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        staffNumber: [
          {
            required: true,
            message: this.$t("staff.staffNumberTitle"),
            trigger: "change"
          }
        ],
        staffName: [
          {
            required: true,
            message: this.$t("staff.staffNameTitle"),
            trigger: "change"
          }
        ],
        sex: [
          {
            required: true,
            message: this.$t("staff.sexTitle"),
            trigger: "change"
          }
        ],
        birthday: [
          {
            required: true,
            message: this.$t("staff.birthdayTitle"),
            trigger: "change"
          }
        ],
        entryday: [
          {
            required: true,
            message: this.$t("staff.entrydayTitle"),
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("staff.phoneTitle"),
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: this.$t("staff.emailTitle"),
            trigger: "change"
          }
        ],
        departmentId: [
          {
            required: true,
            message: this.$t("staff.departmentIdTitle"),
            trigger: "change"
          }
        ]
      };
    });
    let _this = this;
    _this.getstaff(1, 10);
    _this.getDepart();
    _this.pageResize();
    window.onresize = () => {
      _this.pageResize();
    };
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="scss">
#staff {
  .el-radio__label {
    padding-left: 5px;
  }
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #staffPage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);
    &.activeBackground {
      background-color: #fff;
    }
  }

  #batch {
    .el-dialog__body {
      padding: 20px 20px 0px;
      margin: 0px;
    }
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
