<template>
  <div id="productType">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="productTypeQuery">
      <el-form-item :label="$t('productType.product')">
        <el-select v-model="dateQuery.productID" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.productTypeList" :key="index" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addDevice">{{$t('common.add')}}</el-button>
        <el-button type="primary" @click="addBatch">{{$t('common.addBatch')}}</el-button>
        <el-button type="danger" @click="delBatch">{{$t('common.deleteBatch')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="productTypeTable" :data="productTypeData" border style="width:100%;" size="mini" @selection-change="handleSelection" >
      <el-table-column type="selection" width="40"></el-table-column>>
      <el-table-column prop="productID" :label="$t('productType.productID')" width="150"></el-table-column>
      <el-table-column prop="productName" :label="$t('productType.productName')"></el-table-column>
      <el-table-column prop="productColor" :label="$t('productType.productColor')">
        <template slot-scope="scope">
          <p :style="'text-align:center;color:#fff;background:'+scope.row.productColor">{{scope.row.productColor}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="creator" :label="$t('common.creator')"></el-table-column>
      <el-table-column prop="creationTime" :label="$t('common.creationTime')"></el-table-column>
      <el-table-column :label="$t('productType.productPicpath')" width="100px">
        <template slot-scope="scope">
          <viewer :images="[scope.row.productPicpath]" v-if="scope.row.productPicpath">
            <img :src="scope.row.productPicpath" width="32" style="cursor:pointer;" height="32">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column prop="productDescrible" :label="$t('productType.productDescrible')"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" >{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" >{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="productTypePage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total" ></el-pagination>
    <!-- 单个新增弹窗 -->
    <el-dialog :title="deviceuVisibleTitle" :visible.sync="deviceuVisible" width="540px">
      <el-form :model="deviceuForm" :rules="rules" ref="deviceuForm" label-width="170px" class="demo-deviceuForm" >
        <el-form-item :label="$t('productType.productID')" prop="productID">
          <el-input v-model="deviceuForm.productID" v-if="deviceuAddEdit" @blur="checkTypeId" :placeholder="$t('productType.productIDTitle')" ></el-input>
          <el-input v-model="deviceuForm.productID" v-else :readonly="!deviceuAddEdit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('productType.productName')">
          <el-input v-model="deviceuForm.productName" :placeholder="$t('productType.productNameTitle')" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('productType.productColor')">
          <el-color-picker v-model="deviceuForm.productColor"></el-color-picker>
        </el-form-item>
        <el-form-item :label="$t('productType.productDescrible')">
          <el-input v-model="deviceuForm.productDescrible" type="textarea"></el-input>
        </el-form-item>
        <el-form-item :label="$t('productType.productPicpath')">
          <div class="upload-box-logo" style="margin:0px;">
            <el-upload :action="actionUrl" accept="image/jpeg" list-type="picture-card" :data="deviceuForm.imgType" :headers="headerdate" :show-file-list="false" :before-upload="bgUpload" :on-success="bgSuccess" :on-error="bgError" >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="popUp" v-show="deviceuForm.logoBg" @mouseover="bgOver" @mouseout="bgOut">
              <img :src="deviceuForm.productPicpath" alt="logo">
              <div class="mask" v-show="deviceuForm.logoMask">
                <i class="el-icon-delete" @click="deleteBgImg"></i>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('deviceuForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="deviceuVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchVisible" width="1024px" id="batch" >
      <el-form>
        <el-row :gutter="10">
          <el-col :span="6" align="center" style="font-size:14px;font-weight:bold;">{{$t('productType.productID')}}<span class="asterisk">*</span></el-col>
          <el-col :span="6" align="center" style="font-size:14px;font-weight:bold;">{{$t('productType.productName')}}</el-col>
          <el-col :span="6" align="center" style="font-size:14px;font-weight:bold;">{{$t('productType.productDescrible')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;">{{$t('productType.productColor')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;">{{$t('productType.productPicpath')}}</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item,index) in batchForm" :key="item.id" style="margin-bottom:10px;" >
          <el-col :span="6" style="padding-top:8px;">
            <el-input v-model="item.productID" @blur="checkDatchDeviceId(item.productID,index)"></el-input>
          </el-col>
          <el-col :span="6" style="padding-top:8px;">
            <el-input v-model="item.productName"></el-input>
          </el-col>
          <el-col :span="6" style="padding-top:8px;">
            <el-input v-model="item.productDescrible"></el-input>
          </el-col>
          <el-col :span="3" style="padding-top:8px;" align="center">
            <el-color-picker v-model="item.productColor"></el-color-picker>
          </el-col>
          <el-col :span="3" id="batchLogo" align="center">
            <div class="upload-box-logo" style="margin:0px;" @change="change(index)">
              <el-upload :action="actionUrl" accept="image/jpeg" list-type="picture-card" :data="deviceuForm.imgType" :headers="headerdate" :show-file-list="false" :before-upload="bgUpload" :on-success="bgBatchSuccess" :on-error="bgBatchError" >
                <i class="el-icon-plus" style="margin-top: -8px;position: absolute;top: 50%;left: 50%;margin-left: -8px;font-size: 17px;" ></i>
              </el-upload>
              <div class="popUp" v-show="item.logoBg" @mouseover="bgBatchOver(index)" @mouseout="bgBatchOut(index)" >
                <img :src="item.productPicpath" alt="logo">
                <div class="mask" v-show="item.logoMask">
                  <i class="el-icon-delete" @click="deleteBatchBgImg(index)"></i>
                </div>
              </div>
            </div>
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
export default {
  data() {
    return {
      headerdate: {},
      //上传文件地址
      actionUrl: NEW_URL_CONFIG + "/api/file/upload",
      dateQuery: {
        productTypeList: [],
        productID: ""
      },
      productTypeData: [],
      //选择保存值
      selection: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      deviceuVisible: false,
      deviceuAddEdit: false, //true表新增，false表示编辑
      deviceuVisibleTitle: this.$t("common.add"),
      deviceuForm: {
        productID: "",
        productName: "",
        productColor: "",
        productDescrible: "",
        productPicpath: "",
        logoUrl: "",
        logoBg: false,
        logoMask: false,
        imgType: {
          targetEnum: "DeviceUser"
        }
      },
      rules: {
        productID: [
          {
            required: true,
            message: this.$t("productType.productIDTitle"),
            trigger: "change"
          },
          { type: 'required', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        productName: [
          {
            required: true,
            message: this.$t("productType.productNameTitle"),
            trigger: "change"
          }
        ],
        productPicpath: [
          {
            required: true,
            message: this.$t("productType.productPicpathTitle"),
            trigger: "change"
          }
        ]
      },
      batchVisible: false,
      batchUpload: 0,
      batchForm: [
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        }
      ]
    };
  },
  created() {
    //上传文件时验证用户的状态码
    this.headerdate = {
      Authorization:
        sessionStorage.getItem("loginPrefix") +
        " " +
        sessionStorage.getItem("loginToken")
    };
  },
  methods: {
    //获取设备类型下拉列表数据
    getProductList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/production/select/base",
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
          pageSize: 999999
        }
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.dateQuery.productTypeList = [];
          res.data.data.resultObjects.forEach(val => {
            this.dateQuery.productTypeList.push({
              value: val.productID,
              label: val.productID + " " + val.productName
            });
          });
          this.pageResize();
        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({ path: "/login" });
          this.$message({
            showClose: true,
            duration: 2000,
            type: "warning",
            message: this.$t("common.logoutTitle")
          });
        }
      }).catch(res => {
        // console.log(res)
      });
    },
    //获取列表数据
    getProductType(pageIndex, pageSize, productID) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/production/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          productID: productID
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.productTypeData = [];
            res.data.data.resultObjects.forEach(val => {
              this.productTypeData.push({
                productID: val.productID,
                productName: val.productName,
                productColor: val.productColor,
                productDescrible: val.productDescrible,
                creationTime: val.productCreatetimer.replace(/T/, " "),
                creator: val.productCreator,
                productPicpath: val.productPicpath,
                logoUrl: val.productPicpath
              });
            });
            this.pageResize();
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
        .catch(res => {
          // console.log(res)
        });
    },
    //条件查询设备类型
    onSubmit() {
      this.getProductType(1, this.pageTotal, this.dateQuery.productID);
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      this.getProductType(this.currentPage, this.pageTotal);
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProductType(this.currentPage, this.pageTotal);
    },
    //单个验证设备类型编号是否存在。
    checkTypeId() {
      if(this.deviceuForm.productID){
        this.deviceuForm.productID = this.deviceuForm.productID.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.deviceuForm.productID) {
        return false;
      }
      this.$axios({
        method: "get",
        url:
          NEW_URL_CONFIG +
          "/api/production/check/" +
          this.deviceuForm.productID,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.deviceuForm.productID
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.deviceuForm.productID = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("productType.checkTypeId")
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
    //表格选择事件
    handleSelection(val) {
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push(val[i].productID);
        }
      }
    },
    //新增设备类型
    addDevice() {
      this.deviceuVisible = true;
      this.deviceuAddEdit = true;
      this.deviceuVisibleTitle = this.$t("common.add");
      this.deviceuForm.productID = "";
      this.deviceuForm.productName = "";
      this.deviceuForm.productColor = "#05c900";
      this.deviceuForm.productDescrible = "";
      this.deviceuForm.productPicpath = "";
      this.deviceuForm.logoUrl = "";
      this.deviceuForm.logoBg = false;
      this.$nextTick(()=>{
        this.$refs.deviceuForm.clearValidate();
      });
    },
    //编辑设备类型
    handleEdit(index, row) {
      this.deviceuVisible = true;
      this.deviceuAddEdit = false;
      this.deviceuVisibleTitle = this.$t("common.edit");
      this.deviceuForm.productID = row.productID;
      this.deviceuForm.productName = row.productName;
      this.deviceuForm.productColor = row.productColor;
      this.deviceuForm.productDescrible = row.productDescrible;
      this.deviceuForm.productPicpath = row.productPicpath;
      this.deviceuForm.logoUrl = row.logoUrl;
      // console.log(row)
      if (row.logoUrl) {
        this.deviceuForm.logoBg = true;
      } else {
        this.deviceuForm.logoBg = false;
      }
    },
    //删除设备类型
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("productType.product") +
          this.$t("common.delTitleTips2"),
        this.$t("common.tips"),
        {
          cancelButtonText: this.$t("common.cancel"),
          confirmButtonText: this.$t("common.confirm"),
          type: "warning"
        }
      )
        .then(() => {
          this.$axios({
            method: "delete",
            url: NEW_URL_CONFIG + "/api/production/delete/" + row.productID,
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
                // this.getProductType(this.currentPage,this.pageTotal);
                if (
                  this.productTypeData.length == "1" &&
                  this.currentPage != "1"
                ) {
                  this.currentPage = this.currentPage - 1;
                  this.getProductType(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.productName
                  );
                } else {
                  this.getProductType(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.productName
                  );
                }
                this.getProductList();
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.delSuccessTitle")
                });
              } else if (
                res.data.statusCode == 407 ||
                res.data.statusCode == 402
              ) {
                this.$router.push({ path: "/login" });
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("common.logoutTitle")
                });
              } else if (res.data.statusCode == 202) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("productType.delErrorTitle")
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
    //单个设备用户保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let productName = '';
          let productDescrible = '';
          if(this.deviceuForm.productName){
            productName = this.deviceuForm.productName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          }
          if(this.deviceuForm.productDescrible){
            productDescrible = this.deviceuForm.productDescrible.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          }
          let postData = {
            'productID': this.deviceuForm.productID,
            'productName': productName,
            'productColor': this.deviceuForm.productColor,
            'productDescrible': productDescrible,
            'productPicpath': this.deviceuForm.logoUrl
          };
          if (this.deviceuAddEdit) {
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/production/add/single",
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
                  // console.log(res)
                  this.getProductType(this.currentPage, this.pageTotal);
                  this.getProductList();
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.deviceuVisible = false;
                } else if (
                  res.data.statusCode == 407 ||
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
          } else {
            //编辑的保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/production/edit",
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
                  this.getProductType(this.currentPage, this.pageTotal);
                  this.getProductList();
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  this.deviceuVisible = false;
                } else if (
                  res.data.statusCode == 407 ||
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
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          productID: "",
          productName: "",
          productColor: "#05c900",
          productDescrible: "",
          productPicpath: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        }
      ];
    },
    // 验证多个新增设备类型编号是否已存在
    checkDatchDeviceId(val, index) {
      if(this.batchForm[index].productID){
        this.batchForm[index].productID = this.batchForm[index].productID.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.batchForm[index].productID) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (ele.productID) {
          postData.push({
            productID: ele.productID
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].productID == this.batchForm[index].productID) {
          he++;
        }
      }
      if (he > 1) {
        this.batchForm[index].productID = "";
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("productType.checkTypeId")
        });
        return false
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/production/check/" + this.batchForm[index].productID,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchForm[index].productID
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchForm[index].productID = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("productType.checkTypeId")
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
    //保存批量修改
    submitBatch() {
      let postData = [];
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (ele.productID) {
          postData.push(ele);
        } else if (
          !ele.productID &&
          !ele.productName &&
          !ele.productPicpath &&
          // !ele.productColor &&
          !ele.productDescrible
        ) {
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            type: "warning",
            message:
              this.$t("common.batchLineTitle1") +
              (i + 1) +
              this.$t("common.batchLineTitle2") +
              this.$t("productType.productID") +
              this.$t("common.batchLineTitle4")
          });
          return false;
        }
      }
      for (let i = 0; i < postData.length; i++) {
        if(postData[i].productDescrible){
          postData[i].productDescrible = postData[i].productDescrible.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
        if(postData[i].productName){
          postData[i].productName = postData[i].productName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/production/add",
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
            this.getProductType(this.currentPage, this.pageTotal);
            this.getProductList();
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
            this.$t("productType.product") +
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
              url: NEW_URL_CONFIG + "/api/production/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                productionIds: this.selection
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (
                    this.productTypeData.length == this.selection.length &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getProductType(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.productName
                    );
                  } else {
                    this.getProductType(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.productName
                    );
                  }
                  // this.getProductType(this.currentPage,this.pageTotal);
                  this.getProductList();
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.delSuccessTitle")
                  });
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("common.logoutTitle")
                  });
                } else if (res.data.statusCode == 202) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("productType.delErrorTitle")
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
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("productType.delNullTitle")
        });
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    //图片上传前验证
    bgUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension1 = fileName[fileName.length - 1] === "jpg";
      const extension2 = fileName[fileName.length - 1] === "png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension1&&!extension2) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.imgType"),
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.imgSize"),
          type: "warning"
        });
      }
      return (extension1 || extension2) && isLt2M;
    },
    // 背景图片上传成功
    bgSuccess(res) {
      if (res.statusCode == 200) {
        this.deviceuForm.logoBg = true;
        this.deviceuForm.productPicpath = res.data[0].fileUrl;
        this.deviceuForm.logoUrl = res.data[0].fileUrl;
      } else {
      }
    },
    // 背景图片上传失败
    bgError(res) {
      // console.log(res);
    },

    deleteBgImg() {
      this.deviceuForm.logoBg = false;
      this.deviceuForm.productPicpath = "";
      this.deviceuForm.logoUrl = "";
    },
    bgOver() {
      this.deviceuForm.logoMask = true;
    },
    bgOut() {
      this.deviceuForm.logoMask = false;
    },
    change(index) {
      this.batchUpload = index;
    },
    // 背景图片上传成功
    bgBatchSuccess(res) {
      // console.log(res)
      if (res.statusCode == 200) {
        this.batchForm[this.batchUpload].logoBg = true;
        this.batchForm[this.batchUpload].productPicpath = res.data[0].fileUrl;
        this.batchForm[this.batchUpload].logoUrl = res.data[0].fileUrl;
      } else {
      }
    },
    // 背景图片上传失败
    bgBatchError(res) {
      console.log(res);
    },

    deleteBatchBgImg(index) {
      // console.log(index)
      this.batchForm[index].logoBg = false;
      this.batchForm[index].productPicpath = "";
      this.batchForm[index].logoUrl = "";
    },
    bgBatchOver(index) {
      this.batchForm[index].logoMask = true;
    },
    bgBatchOut(index) {
      this.batchForm[index].logoMask = false;
    },
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var productType = document.getElementById("productType");
        var productTypeQuery = document.getElementById("productTypeQuery");
        var productTypeTable = document.getElementById("productTypeTable");
        var productTypePage = document.getElementById("productTypePage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          productTypePage.style.width =
            productTypeTable.clientWidth - 11 + "px";
          productTypePage.style.paddingLeft = "25px";
          productTypePage.style.paddingRight = "25px";
          productTypePage.style.marginLeft =
            -productTypePage.offsetWidth / 2 + "px";
          productTypePage.style.position = "fixed";
          this.active = true;
        } else {
          productTypePage.style.paddingLeft = "5px";
          productTypePage.style.position = "static";
          productTypePage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        productID: [
          {
            required: true,
            message: this.$t("productType.productIDTitle"),
            trigger: "change"
          }
        ],
        productName: [
          {
            required: true,
            message: this.$t("productType.productNameTitle"),
            trigger: "change"
          }
        ],
        productPicpath: [
          {
            required: true,
            message: this.$t("productType.productPicpathTitle"),
            trigger: "change"
          }
        ]
      };
    });
    let _this = this;
    _this.pageResize();
    _this.getProductType(1, 10);
    _this.getProductList();
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
#productType {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #productTypePage {
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
    .asterisk {
      color: #f00;
      font-size: 15px;
      text-align: center;
      display: inline-block;
      width: 12px;
      line-height: 21px;
    }
  }
  .upload-box-logo {
    position: relative;
    width: 148px;
    height: 148px;
    margin: 0px 65px;
    .el-upload--picture-card {
      width: 148px !important;
      height: 148px !important;
      position: relative;
      i {
        font-size: 42px;
        margin-top: 52px;
        p {
          font-size: 18px;
          line-height: 36px;
        }
      }
    }
    .popUp {
      position: absolute;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      border-radius: 6px;
      border: 1px dashed #c0ccda;
      top: 0px;
      left: 0px;
      z-index: 1;
      img {
        position: absolute;
        width: 144px;
        height: 144px;
        border-radius: 6px;
        top: 1px;
        left: 1px;
      }
      .mask {
        position: absolute;
        width: 144px;
        height: 144px;
        border-radius: 6px;
        background-color: rgba(51, 51, 51, 0.8);
        top: 1px;
        left: 1px;
        text-align: center;
        z-index: 2;
        i {
          margin: 55px 10px 0;
          font-size: 32px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  #batchLogo {
    .upload-box-logo {
      position: relative;
      width: 48px;
      height: 48px;
      margin: 0px 65px;
      .el-upload--picture-card {
        width: 48px !important;
        height: 48px !important;
        position: relative;
        i {
          font-size: 12px;
          margin-top: 12px;
          p {
            font-size: 18px;
            line-height: 36px;
          }
        }
      }
      .popUp {
        position: absolute;
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 6px;
        border: 1px dashed #c0ccda;
        top: 0px;
        left: 0px;
        z-index: 1;
        img {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 6px;
          top: 1px;
          left: 1px;
        }
        .mask {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background-color: rgba(51, 51, 51, 0.8);
          top: 1px;
          left: 1px;
          text-align: center;
          z-index: 2;
          i {
            margin: 5px;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
