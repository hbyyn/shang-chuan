<template>
  <div id='device'>
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="deviceQuery">
      <el-form-item :label="$t('device.deviceId')">
        <el-select v-model="dateQuery.deviceFirstName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>--</span>
        <el-select v-model="dateQuery.deviceLastName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('device.employeeId')">
        <el-select v-model="dateQuery.employeeId" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in staffList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('device.deviceType')">
        <el-select v-model="dateQuery.deviceType" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in deviceTypeList" :key="index" :label="item.label" :value="item.value" ></el-option>
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
    <el-table id="deviceTable" :data="deviceData" border style="width:100%;" size="mini" @selection-change="handleSelection">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="deviceId" :label="$t('device.deviceId')"></el-table-column>
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column>
      <el-table-column prop="employeeId" :label="$t('device.employeeId')"></el-table-column>
      <el-table-column prop="deviceTypeName" :label="$t('device.deviceType')"></el-table-column>
      <el-table-column prop="deviceHardwareId" :label="$t('device.deviceHardwareId')"></el-table-column>
      <el-table-column prop="deviceLongitude" :label="$t('device.deviceLongitude')"></el-table-column>
      <el-table-column prop="deviceLatitude" :label="$t('device.deviceLatitude')"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="260px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
          <el-button type="primary" size="mini" @click="handleCode(scope.$index, scope.row)">{{$t('common.qrCode')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id='devicePage' :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count='5' layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog :title="deviceVisibleTitle" :visible.sync="deviceVisible" width="540px" >
      <el-form :model="deviceForm" :rules="rules" ref="deviceForm" label-width="170px" class="demo-deviceForm">
        <el-form-item :label="$t('device.deviceId')" prop="deviceId" >
          <el-input v-model="deviceForm.deviceId" :readonly='deviceForm.addEdit' v-if="deviceForm.addEdit"></el-input>
          <el-input v-model="deviceForm.deviceId" v-else @blur="checkDeviceId" :placeholder="$t('device.deviceIdTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.deviceName')">
          <el-input v-model="deviceForm.deviceName" :placeholder="$t('device.deviceNameTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.employeeId')" prop="employeeId">
          <el-select v-model="deviceForm.employeeId" clearable>
            <el-option v-for="(item,index) in staffList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('device.deviceType')" prop="deviceType">
          <el-select v-model="deviceForm.deviceType" clearable>
            <el-option v-for="(item,index) in deviceTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('device.deviceHardwareId')">
          <el-input v-model="deviceForm.deviceHardwareId" style="width:215px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('device.deviceLongitude')">
           <el-input-number v-model="deviceForm.deviceLongitude" :precision="10" :step="0.00001" :max="180" :min="-180" style="width:215px;"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('device.deviceLatitude')">
           <el-input-number v-model="deviceForm.deviceLatitude" :precision="10" :step="0.00001" :max="90" :min="-90" style="width:215px;"></el-input-number>
        </el-form-item>
        <el-form-item v-if="!deviceForm.lookEdit" style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('deviceForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="deviceVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchVisible" width="1200px" id="batch">
      <el-form >
        <el-row :gutter='10'>
          <el-col :span='6' align='center' style="font-size:14px;font-weight:bold;">{{$t('device.deviceId')}}<span class="asterisk">*</span></el-col>
          <el-col :span='6' align='center' style="font-size:14px;font-weight:bold;">{{$t('device.deviceName')}}</el-col>
          <el-col :span='6' align='center' style="font-size:14px;font-weight:bold;">{{$t('device.employeeId')}}<span class="asterisk">*</span></el-col>
          <el-col :span='6' align='center' style="font-size:14px;font-weight:bold;">{{$t('device.deviceType')}}<span class="asterisk">*</span></el-col>
        </el-row>
        <el-row :gutter='10' v-for="(item,index ) in batchForm" :key='item.id' style="margin-bottom:10px;">
          <el-col :span='6'>
            <el-input v-model="item.deviceId" @blur="checkDatchDeviceId(item.deviceId,index)"></el-input>
          </el-col>
          <el-col :span='6'>
            <el-input v-model="item.deviceName" :placeholder="index==0?$t('device.deviceNameTitle'):$t('common.ditto')"></el-input>
          </el-col>
          <el-col :span='6'>
            <el-select v-model="item.employeeId" :placeholder="index==0?$t('common.select'):$t('common.ditto')" :filterable='true' clearable style="width:100%">
              <el-option v-for="(item,index) in staffList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span='6' align='center'>
            <el-select v-model="item.deviceType" :placeholder="index==0?$t('common.select'):$t('common.ditto')" :filterable='true' clearable style="width:100%">
              <el-option v-for="(item,index) in deviceTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitBatch">{{$t('common.confirm')}}</el-button>
        <el-button @click="batchVisible = false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="qrCodeVisible" width="440px" class='qrCode'>
      <img :src="qrCodeUrl" alt="QR code" width="400" height="400">
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //二维码弹窗
      qrCodeVisible: false,
      qrCodeUrl: '',
      staffList: [],
      deviceTypeList: [],
      dateQuery: {
        deviceList: [],
        deviceFirstName: '',
        deviceLastName: '',
        employeeId: '',
        deviceType: ''
      },
      deviceData: [],
      //开启
      open: this.$t('common.open'),
      close: this.$t('common.close'),
      //选择保存值
      selection: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      deviceVisible: false,
      deviceVisibleTitle: this.$t('common.add'),
      deviceForm: {
        deviceId: '',
        deviceName: '',
        employeeId: '',
        // deviceHardwareId: '',
        // deviceLongitude: 0,
        // deviceLatitude: 0,
        deviceType: '',
        //职员信息弹窗的是新增、编辑还是查看 false示新增、编辑，true表示查看
        lookEdit: false,
        //职员信息弹窗的是新增还是编辑查看 false示新增，true表示编辑、查看
        addEdit: false,
      },
      rules: {
        deviceId: [
          { required: true, message: this.$t('device.deviceIdTitle'), trigger: 'change' },
        ],
        deviceName: [
          { required: true, message: this.$t('device.deviceNameTitle'), trigger: 'change' }
        ],
        employeeId: [
          { required: true, message: this.$t('device.employeeIdTitle'), trigger: 'change' }
        ],
        deviceLongitude: [
          { required: true, message: this.$t('device.deviceLongitudeTitle'), trigger: 'change' }
        ],
        deviceLatitude: [
          { required: true, message: this.$t('device.deviceLatitudeTitle'), trigger: 'change' }
        ],
        deviceType: [
          { required: true, message: this.$t('device.deviceTypeTitle'), trigger: 'change' }
        ]
      },
      batchVisible: false,
      batchForm: [
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''
        }
      ]
    };
  },
  methods: {
    //获取设备编号
    getDeviceList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/device/select",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 99999999
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.dateQuery.deviceList = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.dateQuery.deviceList.push({
              value: val.deviceId,
              label: val.deviceId + ' ' + val.deviceName
            })
          });
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
        // console.log(res)
      });
    },
    //获取职员选择下拉框中的数据
    getStaffList(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/employee/select/base",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "poId": "",
          "dept_id": ""
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          // console.log(res)
          this.staffList = [];
          res.data.data.resultObjects.forEach((val,index)=>{
            this.staffList.push({
              value: val.employeeId,
              label: val.employeeId + ' ' + val.employeeName
            })
          });
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
        // console.log(res)
      });
    },
    //获取设备类型下拉框中的数据
    getDeviceType(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/production/select/base",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 999999,
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.deviceTypeList = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.deviceTypeList.push({
              value: val.productID,
              label: val.productID + ' ' + val.productName
            })
          });
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
        // console.log(res)
      });
    },
    //获取列表数据
    getDevice(pageIndex,pageSize,deviceId,deviceId1,employeeId,deviceType) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/device/select",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "deviceId": deviceId,
          "deviceId1": deviceId1,
          "employeeId": employeeId,
          "deviceType": deviceType,
          "pageIndex": pageIndex,
          "pageSize": pageSize
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.total = res.data.data.count
          this.deviceData = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.deviceData.push({
              deviceId: val.deviceId,
              deviceName: val.deviceName,
              deviceType: val.deviceType,
              deviceTypeName: val.deviceType+ ' ' +val.productName,
              deviceHardwareId: val.deviceHardwareId,
              deviceLongitude: val.deviceLongitude,
              deviceLatitude: val.deviceLatitude,
              employeeId: val.employeeId
            })
          })
          this.pageResize();
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
        // console.log(res)
      });
    },
    //根据列表查询数据
    onSubmit() {
      this.getDevice(1,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
    },
    //表格选择事件
    handleSelection(val){
      this.selection = [];
      if(val.length){
        for (let i = 0; i < val.length; i++) {
          this.selection.push(val[i].deviceId);
        }
      }
    },
    //新增职员
    addStaff(){
      this.deviceVisible = true;
      this.deviceVisibleTitle = this.$t('common.add');
      this.deviceForm.lookEdit = false;
      this.deviceForm.addEdit = false;
      this.deviceForm.deviceId= '';
      this.deviceForm.deviceName= '';
      this.deviceForm.employeeId= '';
      this.deviceForm.deviceHardwareId= '';
      this.deviceForm.deviceLongitude= '';
      this.deviceForm.deviceLatitude= '';
      this.deviceForm.deviceType= '';
      this.$nextTick(()=>{
        this.$refs.deviceForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row){
      this.deviceVisible = true;
      this.deviceVisibleTitle = this.$t('common.edit');
      this.deviceForm.lookEdit = false;
      this.deviceForm.addEdit = true;
      this.deviceForm.deviceId = row.deviceId;
      this.deviceForm.deviceName = row.deviceName;
      this.deviceForm.employeeId = row.employeeId;
      this.deviceForm.deviceHardwareId= row.deviceHardwareId;
      this.deviceForm.deviceLongitude = row.deviceLongitude;
      this.deviceForm.deviceLatitude = row.deviceLatitude;
      this.deviceForm.deviceType = row.deviceType;
    },
    //查看职员
    handleLook(index, row){
      this.deviceVisible = true;
      this.deviceVisibleTitle = this.$t('common.look');
      this.deviceForm.lookEdit = true;
      this.deviceForm.addEdit = false;
      this.deviceForm.deviceId = row.deviceId;
      this.deviceForm.deviceName = row.deviceName;
      this.deviceForm.employeeId = row.employeeId;
      this.deviceForm.deviceHardwareId= row.deviceHardwareId;
      this.deviceForm.deviceLongitude = row.deviceLongitude;
      this.deviceForm.deviceLatitude = row.deviceLatitude;
      this.deviceForm.deviceType = row.deviceType;
    },
    // 验证职员编号是否已存在
    checkDeviceId(){
      if(this.deviceForm.deviceId){
        this.deviceForm.deviceId = this.deviceForm.deviceId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if(!this.deviceForm.deviceId){
        return false
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG+"/api/device/check/"+this.deviceForm.deviceId,
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        params: this.deviceForm.deviceId
      }).then(res=>{
        if(res.data.statusCode == 200&&res.data.data){
          this.deviceForm.deviceId = '';
          this.$message({
              type: 'warning',
              message: this.$t('device.checkId'),
              showClose: true,
              duration:2000
          });
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{

      });
    },
    //删除职员
    handleDelete(index, row){
      this.$confirm(this.$t('common.delTitleTips1')+this.$t('device.device')+this.$t('common.delTitleTips2'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: "delete",
          url: NEW_URL_CONFIG+"/api/device/delete/" + row.deviceId,
          headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
              Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
          },
          data: ''
        }).then(res=>{
          if(res.data.statusCode == 200){
            if(this.deviceData.length == '1'&&this.currentPage != '1') {
              this.currentPage = this.currentPage-1;
              this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
            } else {
              this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
            }
            this.getDeviceList();
            this.$message({
                type: 'success',
                message: this.$t('common.delSuccessTitle'),
                showClose: true,
                duration:2000
            });
          }else if(res.data.statusCode == 407||res.data.statusCode == 402){
            this.$router.push({path: "/login"});
            this.$message({
                type: 'warning',
                message: this.$t('common.logoutTitle'),
                showClose: true,
                duration:2000
            });
          }else if(res.data.statusCode == 202){
            this.$message({
              type: 'warning',
              message: this.$t('device.delErrorTitle'),
              showClose: true,
              duration:2000
            });
          };
        }).catch(res=>{
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.canceledDeletion'),
          showClose: true,
          duration:2000
        });
      });
    },
    //获取二维码
    handleCode(index, row){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/qrcode/devicelogindata",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "clientId": sessionStorage.getItem('comName'),
          "deviceId": row.deviceId
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.qrCodeVisible = true;
          this.qrCodeUrl = "data:image/jpeg;base64,"+res.data.data
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
      });
    },
    //新增、编辑是保存功能
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let deviceName = '';
          let deviceHardwareId = '';
          if(this.deviceForm.deviceName){
            deviceName = this.deviceForm.deviceName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          }
          if(this.deviceForm.deviceHardwareId){
            deviceHardwareId = this.deviceForm.deviceHardwareId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          }
          let postData = {
            "deviceId": this.deviceForm.deviceId,
            "deviceName": deviceName,
            "deviceType": this.deviceForm.deviceType,
            "productID": this.deviceForm.deviceType,
            "deviceHardwareId": deviceHardwareId,
            "deviceLongitude": this.deviceForm.deviceLongitude,
            "deviceLatitude": this.deviceForm.deviceLatitude,
            "employeeId": this.deviceForm.employeeId
          };
          if(!this.deviceForm.addEdit){
            //表示编辑的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG+"/api/device/add/single",
              headers: {
                  "accept": "application/json",
                  "Content-Type": "application/json",
                  Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
              },
              data: postData
            }).then(res=>{
              if(res.data.statusCode == 200){
                this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
                this.getDeviceList()
                this.deviceVisible = false;
                this.$message({
                    type: 'success',
                    message: this.$t('common.addSuccessTitle'),
                    showClose: true,
                    duration:2000
                });
              }else if(res.data.statusCode == 407||res.data.statusCode == 402){
                this.$router.push({path: "/login"});
                this.$message({
                    type: 'warning',
                    message: this.$t('common.logoutTitle'),
                    showClose: true,
                    duration:2000
                });
              };
            }).catch(res=>{
            });
          }else{
            //表示新增的保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG+"/api/device/edit",
              headers: {
                  "accept": "application/json",
                  "Content-Type": "application/json",
                  Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
              },
              data: postData
            }).then(res=>{
              if(res.data.statusCode == 200){
                this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
                this.getDeviceList();
                this.deviceVisible = false;
                this.$message({
                    type: 'success',
                    message: this.$t('common.editSuccessTitle'),
                    showClose: true,
                    duration:2000
                });
              }else if(res.data.statusCode == 407||res.data.statusCode == 402){
                this.$router.push({path: "/login"});
                this.$message({
                    type: 'warning',
                    message: this.$t('common.logoutTitle'),
                    showClose: true,
                    duration:2000
                });
              };
            }).catch(res=>{
              // console.log(res)
            });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 验证多个新增职员编号是否已存在
    checkDatchDeviceId(val,index){
      if(this.batchForm[index].deviceId){
        this.batchForm[index].deviceId = this.batchForm[index].deviceId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if(!this.batchForm[index].deviceId){
        return false
      };
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if(ele.deviceId){
          postData.push({
            "deviceId": ele.deviceId
          });
        };
      };
      postData.sort();
      for(var i = 0; i < postData.length; i++){
        if( postData[i].deviceId == this.batchForm[index].deviceId){
          he++
        }
      };
      if(he>1){
        this.batchForm[index].deviceId = '';
        this.$message({
            type: 'warning',
            message: this.$t('device.checkId'),
            showClose: true,
            duration:2000
        });
        return false
      };
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG+"/api/device/check/"+this.batchForm[index].deviceId,
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        params: this.batchForm[index].deviceId
      }).then(res=>{
        if(res.data.statusCode == 200&&res.data.data){
          this.batchForm[index].deviceId = '';
          this.$message({
              type: 'warning',
              message: this.$t('device.checkId'),
              showClose: true,
              duration:2000
          });
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{

      });
    },
    //批量新增
    addBatch(){
      this.batchVisible = true;
      this.batchForm = [
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        },
        {
          deviceId: '',
          deviceName: '',
          employeeId: '',
          deviceType: '',
          productID: ''

        }
      ]
    },
    //保存批量修改
    submitBatch(){
      let postData = [];
      let eleDeviceName = '';
      let eleEmployeeId = '';
      let eleDeviceType = '';
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if(i=="0"){
          if(ele.deviceId&&ele.employeeId&&ele.deviceType){
            postData.push(ele)
            if(ele.deviceName){
              eleDeviceName = ele.deviceName;
            }
            if(ele.employeeId){
              eleEmployeeId = ele.employeeId;
            }
            if(ele.deviceType){
              eleDeviceType = ele.deviceType;
            }
          }else {
            this.$message({
                type: 'warning',
                message: this.$t('common.batchLineTitle1')+
                (i+1)+
                this.$t('common.batchLineTitle2')+
                this.$t('device.deviceName')+
                this.$t('common.batchLineTitle3')+
                this.$t('device.deviceId')+
                this.$t('common.batchLineTitle3')+
                this.$t('device.deviceType')+
                this.$t('common.batchLineTitle3')+
                this.$t('device.employeeId')+
                this.$t('common.batchLineTitle4'),
                showClose: true,
                duration:2000
            });
            return false
          }
        }else {
          if((ele.deviceName&&!ele.deviceId)||
            (ele.employeeId&&!ele.deviceId)||
            (ele.deviceType&&!ele.deviceId)
          ){
            this.$message({
                type: 'warning',
                message: this.$t('common.batchLineTitle1')+
                (i+1)+
                this.$t('common.batchLineTitle2')+
                this.$t('device.deviceId')+
                this.$t('common.batchLineTitle4'),
                showClose: true,
                duration:2000
            });
            return false
          } else if((!ele.deviceId)){

          } else {
            if(ele.deviceName){
              eleDeviceName = ele.deviceName;
            }
            if(ele.employeeId){
              eleEmployeeId = ele.employeeId;
            }
            if(ele.deviceType){
              eleDeviceType = ele.deviceType;
            }
            ele.deviceName = eleDeviceName;
            ele.employeeId = eleEmployeeId;
            ele.deviceType = eleDeviceType;
            postData.push(ele)
          }
        }
      };
      for (let i = 0; i < postData.length; i++) {
        if(postData[i].deviceName){
          postData[i].deviceName = postData[i].deviceName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
        if(postData[i].deviceType){
          postData[i].productID = postData[i].deviceType;
        }
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/device/add",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: postData
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
          this.getDeviceList();
          this.$message({
              type: 'success',
              message: this.$t('common.addSuccessTitle'),
              showClose: true,
              duration:2000
          });
          this.batchVisible = false;
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
      });
    },
    //批量删除
    delBatch(){
      if(this.selection.length){
        this.$confirm(this.$t('common.delTitleTips1')+this.$t('device.device')+this.$t('common.delTitleTips2'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: "delete",
            url: NEW_URL_CONFIG+"/api/device/delete",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
            },
            data: {
              "deviceIds": this.selection
            }
          }).then(res=>{
            if(res.data.statusCode == 200){
              if(this.deviceData.length == this.selection.length&&this.currentPage != '1') {
                this.currentPage = this.currentPage-1;
                this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
              } else {
                this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
              }
              this.getDeviceList();
              this.$message({
                  type: 'success',
                  message: this.$t('common.delSuccessTitle'),
                  showClose: true,
                  duration:2000
              });
            }else if(res.data.statusCode == 407||res.data.statusCode == 402){
              this.$router.push({path: "/login"});
              this.$message({
                  type: 'warning',
                  message: this.$t('common.logoutTitle'),
                  showClose: true,
                  duration:2000
              });
            }else if(res.data.statusCode == 202){
              this.$message({
                type: 'warning',
                message: this.$t('device.delErrorTitle'),
                showClose: true,
                duration:2000
              });
            };
          }).catch(res=>{
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.canceledDeletion'),
            showClose: true,
            duration:2000
          });
        });
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('device.delNullTitle'),
          showClose: true,
          duration:2000
        });
        return false
      }
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDevice(this.currentPage,this.pageTotal,this.dateQuery.deviceFirstName,this.dateQuery.deviceLastName,this.dateQuery.employeeId,this.dateQuery.deviceType);
    },
    //适配页面
    pageResize(){
      this.$nextTick(()=>{
        var app = document.getElementById('app');
        var device = document.getElementById('device');
        var main = document.getElementById('main');
        var deviceQuery = document.getElementById('deviceQuery');
        var deviceTable = document.getElementById('deviceTable');
        var devicePage = document.getElementById('devicePage');
        if(document.documentElement.scrollHeight > document.documentElement.offsetHeight){
          devicePage.style.width = deviceTable.clientWidth - 11 + 'px'
          devicePage.style.paddingLeft = '25px'
          devicePage.style.paddingRight = '25px'
          devicePage.style.marginLeft = - devicePage.offsetWidth/2 + 'px';
          devicePage.style.position = 'fixed';
          this.active = true;
        }else{
          devicePage.style.paddingLeft = '5px'
          devicePage.style.position = 'static';
          devicePage.style.marginLeft = '0px';
          this.active = false;
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].clearValidate();
    }
  },
  mounted() {
    this.$root.Bus.$on('languageChange',(res)=>{
      this.open = this.$t('common.open');
      this.close = this.$t('common.close');
      this.rules = {
        deviceId: [
          { required: true, message: this.$t('device.deviceIdTitle'), trigger: 'change' },
        ],
        deviceName: [
          { required: true, message: this.$t('device.deviceNameTitle'), trigger: 'change' }
        ],
        employeeId: [
          { required: true, message: this.$t('device.employeeIdTitle'), trigger: 'change' }
        ],
        deviceLongitude: [
          { required: true, message: this.$t('device.deviceLongitudeTitle'), trigger: 'change' }
        ],
        deviceLatitude: [
          { required: true, message: this.$t('device.deviceLatitudeTitle'), trigger: 'change' }
        ],
        deviceType: [
          { required: true, message: this.$t('device.deviceTypeTitle'), trigger: 'change' }
        ]
      };
    })
    let _this = this;
    _this.getStaffList();
    _this.getDeviceType();
    _this.getDeviceList();
    _this.getDevice(1,10);
    _this.pageResize();
    window.onresize = ()=>{
      _this.pageResize();
    }

  },
  destroyed(){
    window.onresize = null;
  }
}
</script>
<style lang="scss">
#device{
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item{
    margin-bottom: 20px;
  }
  #devicePage{
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75,75,75,.0);
    &.activeBackground{
      background-color: #fff;
    }
  }
  #batch{
    .el-dialog__body{
      padding: 20px 20px 0px;
      margin: 0px;
    }
    .asterisk{
      color:#f00;
      font-size: 15px;
      text-align: center;
      display: inline-block;
      width: 12px;
      line-height: 21px;
    }
  }
  .qrCode{
    .el-dialog{
      box-shadow: 0px 0px 0px;
      background:transparent!important;
      position: relative;
      .el-dialog__header{
        border-bottom: 0px solid #000!important;
        position: absolute;
        top: 10px;
        right: 0px;
        .el-dialog__close{
          font-size: 40px;
        }
        .el-dialog__headerbtn{
          top: -5px;
          right: -5px;
          border-radius: 50%;
          background: #fff;
        }
      }
    }
  }
}
</style>
