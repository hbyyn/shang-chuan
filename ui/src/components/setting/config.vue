<template>
  <div id="config">
    <el-tabs type="border-card" id="config_tab" @tab-click="tab_click">
      <el-tab-pane :label="$t('config.faceCon')">
        <div if="face">
          <el-form :inline="true" :model="faceQuery" class="demo-form-inline" id="deviceQuery">
            <el-form-item :label="$t('config.faceId')">
              <el-select v-model="faceQuery.faceId" filterable clearable :placeholder="$t('common.select')">
                <el-option v-for="item in faceQuery.faceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('config.faceUse')">
              <el-select v-model="faceQuery.faceUse" filterable clearable :placeholder="$t('common.select')">
                <el-option v-for="item in faceQuery.faceUseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="faceSubmit">{{$t('common.query')}}</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" @click="addFace">{{$t('common.add')}}</el-button>
              <el-button type="primary" @click="addFaceBatch">{{$t('common.addBatch')}}</el-button>
              <el-button type="danger" @click="delFaceBatch">{{$t('common.deleteBatch')}}</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="faceData" border style="width: 100%" @selection-change="faceSelection">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="faceId" :label="$t('config.faceId')" width="180"></el-table-column>
            <el-table-column prop="faceStandard" :label="$t('config.faceStandard')"></el-table-column>
            <!-- <el-table-column prop="faceDll" :label="$t('config.faceDll')"></el-table-column> -->
            <el-table-column prop="faceUse" :label="$t('config.faceUse')" width="100" align="center">
              <template slot-scope="scope">
                <span v-html="scope.row.faceUse?$t('common.open'):$t('common.close')"></span>
              </template>
            </el-table-column>
            <el-table-column prop="creater" :label="$t('common.creator')" width="180"></el-table-column>
            <el-table-column prop="createTime" :label="$t('common.creationTime')" width="180"></el-table-column>
            <el-table-column :label="$t('common.operation')" align="center" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="faceEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
                <el-button size="mini" type="danger" @click="faceDel(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('config.alcoholCon')">
        <div id="alcoholhol">
          <el-form :inline="true" :model="alcoholQuery" class="demo-form-inline" id="deviceQuery">
            <el-form-item :label="$t('config.alcoholId')">
              <el-select v-model="alcoholQuery.alcoholId" filterable clearable>
                <el-option v-for="item in alcoholQuery.alcoholList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="alcoholSubmit">{{$t('common.query')}}</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" @click="addAlcohol">{{$t('common.add')}}</el-button>
              <el-button type="primary" @click="addAlcoholBatch">{{$t('common.addBatch')}}</el-button>
              <el-button type="danger" @click="delAlcoholBatch">{{$t('common.deleteBatch')}}</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="alcoholData" border style="width: 100%" @selection-change="alcoholSelection">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="alcoholId" :label="$t('config.alcoholId')" width="180"></el-table-column>
            <el-table-column prop="alcoholStandard1" :label="$t('config.alcoholStandard1')"></el-table-column>
            <el-table-column prop="alcoholStandard2" :label="$t('config.alcoholStandard2')"></el-table-column>
            <el-table-column prop="alcoholStandard3" :label="$t('config.alcoholStandard3')"></el-table-column>
            <el-table-column prop="alcoholCountry" :label="$t('config.alcoholCountry')" width="150" align="center"></el-table-column>
            <el-table-column prop="alcoholUnit" :label="$t('config.alcoholUnit')" width="100" align="center"></el-table-column>
            <el-table-column prop="alcoholDescrible" :label="$t('config.alcoholDescrible')"></el-table-column>
            <el-table-column prop="creater" :label="$t('common.creator')" width="180"></el-table-column>
            <el-table-column prop="createTime" :label="$t('common.creationTime')" width="180"></el-table-column>
            <el-table-column :label="$t('common.operation')" align="center" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="alcoholEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
                <el-button size="mini" type="danger" @click="alcoholDel(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 人脸弹窗 -->
    <el-dialog :title="faceTitle" :visible.sync="faceVisible" width="540px">
      <el-form :model="faceForm" :rules="faceRules" ref="faceForm" label-width="150px" class="demo-faceForm">
        <el-form-item :label="$t('config.faceId')" prop="faceId">
          <el-input v-model="faceForm.faceId" v-if="faceBool" @blur="checkFaceId" :placeholder="$t('config.faceIdTitle')"></el-input>
          <el-input v-model="faceForm.faceId" v-else :readonly="!faceBool"></el-input>
        </el-form-item>
        <el-form-item :label="$t('config.faceStandard')" prop="faceStandard">
          <el-input-number v-model="faceForm.faceStandard" :placeholder="$t('config.faceStandardTitle')" style="width:100%"></el-input-number>
        </el-form-item>
        <!-- <el-form-item :label="$t('config.faceCon')">
          <el-input v-model="faceForm.faceDll" :placeholder="$t('config.faceDllTitle')"></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('config.faceUse')">
          <el-switch v-model="faceForm.faceUse"></el-switch>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitFace('faceForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="faceVisible = false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量人脸新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchFaceVisible" width="840px" id="batch" >
      <el-form>
        <el-row :gutter="10">
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;"> {{$t('config.faceId')}}<span class="asterisk">*</span></el-col>
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;" ><span class="asterisk">*</span>{{$t('config.faceStandard')}}</el-col>
          <!-- <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;" >{{$t('config.faceDll')}}</el-col> -->
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;" >{{$t('config.faceUse')}}</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item,index ) in batchFaceForm" :key="item.id" style="margin-bottom:10px;" >
          <el-col :span="8">
            <el-input v-model="item.faceId" @blur="checkDatchFaceId(item.faceId,index)"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input-number v-model="item.faceStandard"  style="width:260px;" ></el-input-number>
          </el-col>
          <!-- <el-col :span="8">
            <el-input v-model="item.faceDll" :placeholder="index==0?$t('common.pleaseInput'):$t('common.ditto')" ></el-input>
          </el-col> -->
          <el-col :span="8" align="center">
            <el-switch v-model="item.faceUse"></el-switch>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitBatchFace">{{$t('common.confirm')}}</el-button>
        <el-button @click="batchFaceVisible = false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!-- 酒精弹窗 -->
    <el-dialog :title="alcoholTitle" :visible.sync="alcoholVisible" width="540px">
      <el-form :model="alcoholForm" :rules="alcoholRules" ref="alcoholForm" label-width="150px" class="demo-alcoholForm">
        <el-form-item :label="$t('config.alcoholId')" prop="alcoholId">
          <el-input v-model="alcoholForm.alcoholId" v-if="alcoholBool" @blur="checkAlcoholId" :placeholder="$t('config.alcoholIdTitle')"></el-input>
          <el-input v-model="alcoholForm.alcoholId" v-else :readonly="!alcoholBool"></el-input>
        </el-form-item>
        <el-form-item :label="$t('config.alcoholStandard1')" prop="alcoholStandard1">
          <el-select v-model="alcoholForm.alcoholStandard1" clearable :placeholder="$t('config.alcoholStandardTitle1')">
            <el-option v-for="item in alcoholForm.alcoholStandardList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.alcoholStandard2')">
          <el-select v-model="alcoholForm.alcoholStandard2" clearable :placeholder="$t('config.alcoholStandardTitle2')">
            <el-option v-for="item in alcoholForm.alcoholStandardList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.alcoholStandard3')">
          <el-select v-model="alcoholForm.alcoholStandard3" clearable :placeholder="$t('config.alcoholStandardTitle3')">
            <el-option v-for="item in alcoholForm.alcoholStandardList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.alcoholCountry')">
          <el-select v-model="alcoholForm.alcoholCountry" clearable :placeholder="$t('config.alcoholCountryTitle')">
            <el-option v-for="item in alcoholForm.alcoholCountryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.alcoholUnit')">
          <el-select v-model="alcoholForm.alcoholUnit" clearable :placeholder="$t('config.alcoholUnitTitle')">
            <el-option v-for="item in alcoholForm.alcoholUnitList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.alcoholDescrible')">
          <el-input v-model="alcoholForm.alcoholDescrible" type="textarea" :placeholder="$t('config.alcoholDescribleTitle')" ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitAlcohol('alcoholForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="alcoholVisible = false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量酒精新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchAlcoholVisible" width="1024px" id="batch" >
      <el-form>
        <el-row :gutter="10">
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;">{{$t('config.alcoholId')}}<span class="asterisk">*</span></el-col>
          <el-col :span="4" align="center" style="font-size:14px;font-weight:bold;"><span class="asterisk">*</span>{{$t('config.alcoholStandard1')}}</el-col>
          <el-col :span="4" align="center" style="font-size:14px;font-weight:bold;">{{$t('config.alcoholStandard2')}}</el-col>
          <el-col :span="4" align="center" style="font-size:14px;font-weight:bold;">{{$t('config.alcoholStandard3')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;">{{$t('config.alcoholCountry')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;">{{$t('config.alcoholUnit')}}</el-col>
          <el-col :span="3" align="center" style="font-size:14px;font-weight:bold;">{{$t('config.alcoholDescrible')}}</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item,index ) in batchAlcoholForm" :key="item.id" style="margin-bottom:10px;">
          <el-col :span="3">
            <el-input v-model="item.alcoholId" @blur="checkDatchAlcoholId(item.alcoholId,index)"></el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="item.alcoholStandard" clearable :placeholder="index==0?$t('config.alcoholStandardTitle1'):$t('common.ditto')">
              <el-option v-for="item in alcoholForm.alcoholStandardList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="item.alcoholTwoLevel" clearable :placeholder="index==0?$t('config.alcoholStandardTitle2'):$t('common.ditto')">
              <el-option v-for="item in alcoholForm.alcoholStandardList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="item.alcoholThreeLevel" clearable :placeholder="index==0?$t('config.alcoholStandardTitle3'):$t('common.ditto')">
              <el-option v-for="item in alcoholForm.alcoholStandardList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="item.alcoholCountry" clearable :placeholder="index==0?$t('config.alcoholCountryTitle'):$t('common.ditto')">
              <el-option v-for="items in alcoholForm.alcoholCountryList" :key="items.value" :label="items.label" :value="items.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="item.alcoholUnit" clearable :placeholder="index==0?$t('config.alcoholUnitTitle'):$t('common.ditto')">
              <el-option v-for="items in alcoholForm.alcoholUnitList" :key="items.value" :label="items.label" :value="items.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input v-model="item.alcoholDescrible"></el-input>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitBatchAlcohol">{{$t('common.confirm')}}</el-button>
        <el-button @click="batchAlcoholVisible = false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectionFace: [],
      selectionAlcohol: [],
      //tab的页面
      tabIndex: "0",
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      faceQuery: {
        faceId: "",
        faceList: [],
        faceUse: "",
        faceUseList: [
          {
            value: true,
            label: this.$t("common.open")
          },
          {
            value: false,
            label: this.$t("common.close")
          }
        ]
      },
      faceData: [],
      faceVisible: false,
      faceTitle: this.$t("common.add"),
      faceBool: true, //true新增false编辑
      faceForm: {
        faceId: "",
        faceStandard: 0,
        faceDll: "",
        faceUse: true
      },
      faceRules: {
        faceId: [
          {
            required: true,
            message: this.$t("config.faceIdTitle"),
            trigger: "change"
          }
        ],
        faceStandard: [
          {
            required: true,
            message: this.$t("config.faceStandardTitle"),
            trigger: "change"
          }
        ],
        faceDll: [
          {
            required: true,
            message: this.$t("config.faceDllTitle"),
            trigger: "change"
          }
        ]
      },
      batchFaceVisible: false,
      batchFaceForm: [
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        }
      ],
      alcoholQuery: {
        alcoholId: "",
        alcoholList: []
      },
      alcoholData: [],
      alcoholVisible: false,
      alcoholTitle: this.$t("common.add"),
      alcoholBool: true, //true新增false编辑
      alcoholForm: {
        alcoholId: "",
        alcoholCountry: "",
        alcoholCountryList: [],
        alcoholUnit: "",
        alcoholUnitList: [],
        alcoholStandard1: '',
        alcoholStandard2: '',
        alcoholStandard3: '',
        alcoholStandardList: [],
        alcoholDescrible: ""
      },
      alcoholRules: {
        alcoholId: [
          {
            required: true,
            message: this.$t("config.alcoholIdTitle"),
            trigger: "change"
          }
        ],
        alcoholCountry: [
          {
            required: true,
            message: this.$t("config.alcoholCountryTitle"),
            trigger: "change"
          }
        ],
        alcoholUnit: [
          {
            required: true,
            message: this.$t("config.alcoholUnitTitle"),
            trigger: "change"
          }
        ],
        alcoholStandard1: [
          {
            required: true,
            message: this.$t("config.alcoholStandardTitle1"),
            trigger: "change"
          }
        ],
        alcoholDescrible: [
          {
            required: true,
            message: this.$t("config.alcoholDescribleTitle"),
            trigger: "change"
          }
        ]
      },
      batchAlcoholVisible: false,
      batchAlcoholForm: [
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        }
      ]
    };
  },
  methods: {
    //获取人脸下拉列表数据
    getFaceList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/face/select",
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
          pageSize: 99999999
        }
      })
        .then(res => {
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.faceQuery.faceList = [];
            res.data.data.resultObjects.forEach(val => {
              this.faceQuery.faceList.push({
                value: val.faceId,
                label: val.faceId
              });
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
        .catch(res => {
          // console.log(res)
        });
    },
    //获取人脸列表数据
    getFace(pageIndex, pageSize, faceId, faceUse) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/face/select",
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
          faceId: faceId,
          faceUse: faceUse
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.faceData = [];
            res.data.data.resultObjects.forEach(val => {
              this.faceData.push({
                faceId: val.faceId,
                faceStandard: val.faceStandard,
                faceDll: val.faceDll,
                faceUse: val.faceUse,
                creater: val.faceCreator,
                createTime: val.faceCreatetime
              });
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
        .catch(res => {
          // console.log(res)
        });
    },
    //人脸搜索
    faceSubmit() {
      this.getFace(
        this.currentPage,
        this.pageTotal,
        this.faceQuery.faceId,
        this.faceQuery.faceUse
      );
    },
    //验证人脸编号
    checkFaceId() {
      this.faceForm.faceId = this.faceForm.faceId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      if (!this.faceForm.faceId) {
        return false;
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/face/check/" + this.faceForm.faceId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: { faceId: this.faceForm.faceId }
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.faceForm.faceId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("config.faceCheck")
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
    faceSelection(val) {
      this.selectionFace = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selectionFace.push(val[i].faceId);
        }
      }
    },
    //新增人脸
    addFace() {
      this.faceVisible = true;
      this.faceBool = true;
      this.faceTitle = this.$t("common.add");
      this.faceForm.faceId = "";
      this.faceForm.faceStandard = 0;
      this.faceForm.faceDll = "";
      this.faceForm.faceUse = false;
      this.$nextTick(()=>{
        this.$refs.faceForm.clearValidate();
      });
    },
    //编辑人脸
    faceEdit(index, row) {
      // console.log(index, row);
      this.faceVisible = true;
      this.faceBool = false;
      this.faceTitle = this.$t("common.edit");
      this.faceForm.faceId = row.faceId;
      this.faceForm.faceStandard = row.faceStandard;
      this.faceForm.faceDll = row.faceDll;
      this.faceForm.faceUse = row.faceUse;
    },
    //删除人脸
    faceDel(index, row) {
      // console.log(index, row);
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("config.face") +
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
            url: NEW_URL_CONFIG + "/api/face/delete/" + row.faceId,
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
                if (this.faceData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  if (typeof this.faceQuery.faceUse == "string") {
                    this.getFace(
                      this.currentPage,
                      this.pageTotal,
                      this.faceQuery.faceId
                    );
                  } else {
                    this.getFace(
                      this.currentPage,
                      this.pageTotal,
                      this.faceQuery.faceId,
                      this.faceQuery.faceUse
                    );
                  }
                } else {
                  if (typeof this.faceQuery.faceUse == "string") {
                    this.getFace(
                      this.currentPage,
                      this.pageTotal,
                      this.faceQuery.faceId
                    );
                  } else {
                    this.getFace(
                      this.currentPage,
                      this.pageTotal,
                      this.faceQuery.faceId,
                      this.faceQuery.faceUse
                    );
                  }
                }
                this.getFaceList();
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
              } else if (
                res.data.statusCode == 202
              ) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("config.delFaceError")
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
    //保存人脸
    submitFace(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = {
            faceDll: this.faceForm.faceDll.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''),
            faceStandard: this.faceForm.faceStandard,
            faceId: this.faceForm.faceId,
            faceUse: this.faceForm.faceUse
          };
          if (this.faceBool) {
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/face/add/single",
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
                  this.faceVisible = false;
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.getFace(this.currentPage, this.pageTotal);
                  this.getFaceList();
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
              .catch(res => {
                // console.log(res)
              });
          } else {
            //编辑保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/face/edit",
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
                  this.faceVisible = false;
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  this.getFace(this.currentPage, this.pageTotal);
                  this.getFaceList();
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
    // 验证批量人脸编号存在
    checkDatchFaceId(val, index) {
      this.batchFaceForm[index].faceId = this.batchFaceForm[index].faceId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      if (!this.batchFaceForm[index].faceId) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchFaceForm.length; i++) {
        const ele = this.batchFaceForm[i];
        if (ele.faceId) {
          postData.push({
            faceId: ele.faceId
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].faceId == this.batchFaceForm[index].faceId) {
          he++;
        }
      }
      if (he > 1) {
        this.batchFaceForm[index].faceId = "";
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("config.faceCheck")
        });
        return false
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/face/check/" + this.batchFaceForm[index].faceId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchFaceForm[index].faceId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchFaceForm[index].faceId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("config.faceCheck")
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
    //批量人脸新增
    addFaceBatch() {
      this.batchFaceVisible = true;
      this.batchFaceForm = [
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        },
        {
          faceId: "",
          faceStandard: 0,
          faceDll: "",
          faceUse: false
        }
      ];
    },
    //批量人脸新增保存
    submitBatchFace() {
      let postData = [];
      let eleFaceDll = "";
      for (let i = 0; i < this.batchFaceForm.length; i++) {
        const ele = this.batchFaceForm[i];
        if (i == "0") {
          if (ele.faceId&&!isNaN(ele.faceStandard)) {
            postData.push(ele);
            if (ele.faceDll) {
              eleFaceDll = ele.faceDll;
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
                this.$t("config.faceId") +
                this.$t("common.batchLineTitle3") +
                this.$t("config.faceStandard") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          }
        } else {
          if (ele.faceDll && !ele.faceId||ele.faceDll && !ele.faceStandard) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("config.faceId") +
                this.$t("common.batchLineTitle3") +
                this.$t("config.faceStandard") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          } else if (!ele.faceId) {
          } else {
            if (ele.faceDll) {
              eleFaceDll = ele.faceDll;
            }
            ele.faceDll = eleFaceDll;
            postData.push(ele);
          }
        }
      }
      for (let i = 0; i < postData.length; i++) {
        const element = postData[i];
        postData[i].faceDll = postData[i].faceDll.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/face/add",
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
            this.getFace(this.currentPage, this.pageTotal);
            this.getFaceList();
            this.$message({
              showClose: true,
              duration: 2000,
              type: "success",
              message: this.$t("common.addSuccessTitle")
            });
            this.batchFaceVisible = false;
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
    //批量删除人脸
    delFaceBatch() {
      if (this.selectionFace.length) {
        this.$confirm(
          this.$t("common.delTitleTips1") +
            this.$t("config.face") +
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
              url: NEW_URL_CONFIG + "/api/face/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                faceIds: this.selectionFace
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (
                    this.faceData.length == this.selectionFace.length &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    if (typeof this.faceQuery.faceUse == "string") {
                      this.getFace(
                        this.currentPage,
                        this.pageTotal,
                        this.faceQuery.faceId
                      );
                    } else {
                      this.getFace(
                        this.currentPage,
                        this.pageTotal,
                        this.faceQuery.faceId,
                        this.faceQuery.faceUse
                      );
                    }
                  } else {
                    if (typeof this.faceQuery.faceUse == "string") {
                      this.getFace(
                        this.currentPage,
                        this.pageTotal,
                        this.faceQuery.faceId
                      );
                    } else {
                      this.getFace(
                        this.currentPage,
                        this.pageTotal,
                        this.faceQuery.faceId,
                        this.faceQuery.faceUse
                      );
                    }
                  }
                  this.getFaceList();
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
                } else if (
                  res.data.statusCode == 202
                ) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("config.delFaceError")
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
          message: this.$t("config.delFaceNullTitle")
        });
        return false;
      }
    },
    //获取酒精下拉列表数据
    getAlcoholList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/alcohol/select",
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
          pageSize: 99999999
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.alcoholQuery.alcoholList = [];
            res.data.data.resultObjects.forEach(val => {
              this.alcoholQuery.alcoholList.push({
                value: val.alcoholId,
                label: val.alcoholId
              });
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
        .catch(res => {
          // console.log(res)
        });
    },
    //获取酒精列表数据
    getAlcohol(pageIndex, pageSize, alcoholId, alcoholStandard) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/alcohol/select",
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
          alcoholId: alcoholId,
          alcoholStandard: alcoholStandard
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.alcoholData = [];
            res.data.data.resultObjects.forEach(val => {
              this.alcoholData.push({
                alcoholId: val.alcoholId,
                alcoholCountry: val.alcoholCountry,
                alcoholUnit: val.alcoholUnit,
                alcoholStandard1: val.alcoholStandard,
                alcoholStandard2: val.alcoholTwoLevel,
                alcoholStandard3: val.alcoholThreeLevel,
                alcoholDescrible: val.alcoholDescrible,
                creater: val.alcoholCreator,
                createTime: val.alcoholCreatetime
              });
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
        .catch(res => {
          // console.log(res)
        });
    },
    //搜索
    alcoholSubmit() {
      this.getAlcohol(
        this.currentPage,
        this.pageTotal,
        this.alcoholQuery.alcoholId
      );
    },
    //验证酒精编号
    checkAlcoholId() {
      this.alcoholForm.alcoholId = this.alcoholForm.alcoholId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      if (!this.alcoholForm.alcoholId) {
        return false;
      }
      this.$axios({
        method: "get",
        url:
          NEW_URL_CONFIG + "/api/alcohol/check/" + this.alcoholForm.alcoholId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: { alcoholId: this.alcoholForm.alcoholId }
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.alcoholForm.alcoholId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("config.alcoholCheck")
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
    alcoholSelection(val) {
      this.selectionAlcohol = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selectionAlcohol.push(val[i].alcoholId);
        }
      }
    },
    //新增酒精
    addAlcohol() {
      this.alcoholVisible = true;
      this.alcoholBool = true;
      this.alcoholTitle = this.$t("common.add");
      this.alcoholForm.alcoholId = "";
      this.alcoholForm.alcoholCountry = "";
      this.alcoholForm.alcoholUnit = "";
      this.alcoholForm.alcoholStandard1 = "";
      this.alcoholForm.alcoholStandard2 = "";
      this.alcoholForm.alcoholStandard3 = "";
      this.alcoholForm.alcoholDescrible = "";
      this.$nextTick(()=>{
        this.$refs.alcoholForm.clearValidate();
      });
    },
    //编辑酒精
    alcoholEdit(index, row) {
      this.alcoholVisible = true;
      this.alcoholBool = false;
      this.alcoholTitle = this.$t("common.edit");
      this.alcoholForm.alcoholId = row.alcoholId;
      this.alcoholForm.alcoholCountry = row.alcoholCountry;
      this.alcoholForm.alcoholUnit = row.alcoholUnit;
      this.alcoholForm.alcoholStandard1 = row.alcoholStandard1;
      this.alcoholForm.alcoholStandard2 = row.alcoholStandard2;
      this.alcoholForm.alcoholStandard3 = row.alcoholStandard3;
      this.alcoholForm.alcoholDescrible = row.alcoholDescrible;
    },
    //删除酒精
    alcoholDel(index, row) {
      // console.log(index, row);
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("config.alcohol") +
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
            url: NEW_URL_CONFIG + "/api/alcohol/delete/" + row.alcoholId,
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
                if (this.alcoholData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  this.getAlcohol(
                    this.currentPage,
                    this.pageTotal,
                    this.alcoholQuery.alcoholId
                  );
                } else {
                  this.getAlcohol(
                    this.currentPage,
                    this.pageTotal,
                    this.alcoholQuery.alcoholId
                  );
                }
                // this.getAlcohol(this.currentPage,this.pageTotal);
                this.getAlcoholList();
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
              } else if (
                res.data.statusCode == 202
              ) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("config.delAlcoholError")
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
    //保存酒精
    submitAlcohol(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = {
            alcoholUnit: this.alcoholForm.alcoholUnit,
            alcoholCountry: this.alcoholForm.alcoholCountry,
            alcoholId: this.alcoholForm.alcoholId,
            alcoholStandard: this.alcoholForm.alcoholStandard1,
            alcoholTwoLevel: this.alcoholForm.alcoholStandard2,
            alcoholThreeLevel: this.alcoholForm.alcoholStandard3,
            alcoholDescrible: this.alcoholForm.alcoholDescrible
          };
          if (this.alcoholBool) {
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/alcohol/add/single",
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
                // console.log(res)
                if (res.data.statusCode == 200) {
                  this.alcoholVisible = false;
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.getAlcohol(this.currentPage, this.pageTotal);
                  this.getAlcoholList();
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
              .catch(res => {
                // console.log(res)
              });
          } else {
            //编辑保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/alcohol/edit",
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
                  this.alcoholVisible = false;
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  this.getAlcohol(this.currentPage, this.pageTotal);
                  this.getAlcoholList();
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
    // 验证批量酒精编号存在
    checkDatchAlcoholId(val, index) {
      this.batchAlcoholForm[index].alcoholId = this.batchAlcoholForm[index].alcoholId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      if (!this.batchAlcoholForm[index].alcoholId) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchAlcoholForm.length; i++) {
        const ele = this.batchAlcoholForm[i];
        if (ele.alcoholId) {
          postData.push({
            alcoholId: ele.alcoholId
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].alcoholId == this.batchAlcoholForm[index].alcoholId) {
          he++;
        }
      }
      if (he > 1) {
        this.batchAlcoholForm[index].alcoholId = "";
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("config.alcoholCheck")
        });
        return false
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/alcohol/check/" + this.batchAlcoholForm[index].alcoholId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchAlcoholForm[index].alcoholId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchAlcoholForm[index].alcoholId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("config.alcoholCheck")
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
    //批量酒精新增
    addAlcoholBatch() {
      this.batchAlcoholVisible = true;
      this.batchAlcoholForm = [
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        },
        {
          alcoholId: "",
          alcoholCountry: "",
          alcoholUnit: "",
          alcoholStandard: "",
          alcoholTwoLevel: "",
          alcoholThreeLevel: "",
          alcoholDescrible: ""
        }
      ];
    },
    //批量酒精新增保存
    submitBatchAlcohol() {
      let postData = [];
      let alcoholStandardL = '',alcoholTwoLevelL = '',alcoholThreeLevelL = '',alcoholCountryL = '',alcoholUnitL = '';
      for (let i = 0; i < this.batchAlcoholForm.length; i++) {
        const ele = this.batchAlcoholForm[i];
        // console.log(ele)
        if (i == "0") {
          if (ele.alcoholId&&ele.alcoholStandard) {
            postData.push(ele);
            alcoholStandardL = ele.alcoholStandard;
            alcoholTwoLevelL = ele.alcoholTwoLevel;
            alcoholThreeLevelL = ele.alcoholThreeLevel;
            alcoholCountryL = ele.alcoholCountry;
            alcoholUnitL = ele.alcoholUnit;
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("config.alcoholId") +
                this.$t("common.batchLineTitle3") +
                this.$t("config.alcoholStandard1") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          }
        } else {
          if (
            (ele.alcoholCountry && !ele.alcoholId) ||
            (ele.alcoholUnit && !ele.alcoholId) ||
            (ele.alcoholDescrible && !ele.alcoholId)||
            (ele.alcoholTwoLevel && !ele.alcoholId)||
            (ele.alcoholThreeLevel && !ele.alcoholId)
          ) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("config.alcoholId") +
                this.$t("common.batchLineTitle3") +
                this.$t("config.alcoholStandard1") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          } else if (!ele.alcoholId) {
          } else {
            if(ele.alcoholStandard){
              alcoholStandardL = ele.alcoholStandard;
            }
            if(ele.alcoholTwoLevel){
              alcoholTwoLevelL = ele.alcoholTwoLevel;
            }
            if(ele.alcoholThreeLevel){
              alcoholThreeLevelL = ele.alcoholThreeLevel;
            }
            if(ele.alcoholCountry){
              alcoholCountryL = ele.alcoholCountry;
            }
            if(ele.alcoholUnit){
              alcoholUnitL = ele.alcoholUnit;
            }
            ele.alcoholStandard = alcoholStandardL;
            ele.alcoholTwoLevel = alcoholTwoLevelL;
            ele.alcoholThreeLevel = alcoholThreeLevelL;
            ele.alcoholCountry = alcoholCountryL;
            ele.alcoholUnit = alcoholUnitL;
            postData.push(ele);
          }
        }
      }
      for (let i = 0; i < postData.length; i++) {
        postData[i].alcoholCountry = postData[i].alcoholCountry.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        postData[i].alcoholUnit = postData[i].alcoholUnit.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        postData[i].alcoholDescrible = postData[i].alcoholDescrible.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!postData.length) {
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message:
            this.$t("common.batchLineTitle1") +
            (i + 1) +
            this.$t("common.batchLineTitle2") +
            this.$t("config.alcoholId") +
            this.$t("common.batchLineTitle4")
        });
        return false;
      }
      // console.log(postData)
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/alcohol/add",
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
            this.getAlcohol(this.currentPage, this.pageTotal);
            this.getAlcoholList();
            this.$message({
              showClose: true,
              duration: 2000,
              type: "success",
              message: this.$t("common.addSuccessTitle")
            });
            this.batchAlcoholVisible = false;
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
    //批量删除酒精检测
    delAlcoholBatch() {
      if (this.selectionAlcohol.length) {
        this.$confirm(
          this.$t("common.delTitleTips1") +
            this.$t("config.alcohol") +
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
              url: NEW_URL_CONFIG + "/api/alcohol/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                alcoholIds: this.selectionAlcohol
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (
                    this.alcoholData.length == this.selectionAlcohol.length &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getAlcohol(
                      this.currentPage,
                      this.pageTotal,
                      this.alcoholQuery.alcoholId
                    );
                  } else {
                    this.getAlcohol(
                      this.currentPage,
                      this.pageTotal,
                      this.alcoholQuery.alcoholId
                    );
                  }
                  this.getAlcoholList();
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
                } else if (
                  res.data.statusCode == 202
                ) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("config.delAlcoholError")
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
          message: this.$t("config.delAlcoholNullTitle")
        });
        return false;
      }
    },
    tab_click(val) {
      this.tabIndex = val.index;
      this.pageTotal = 10;
      this.currentPage = 1;
      if (val.index == "0") {
        this.getFace(this.currentPage, this.pageTotal);
        this.getFaceList();
      } else if (val.index == "1") {
        this.getAlcohol(this.currentPage, this.pageTotal);
        this.getAlcoholList();
      }
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      if (this.tabIndex == "0") {
        this.getFace(this.currentPage, this.pageTotal);
      } else if (this.tabIndex == "1") {
        this.getAlcohol(this.currentPage, this.pageTotal);
      }
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.tabIndex == "0") {
        this.getFace(this.currentPage, this.pageTotal);
      } else if (this.tabIndex == "1") {
        this.getAlcohol(this.currentPage, this.pageTotal);
      }
    }
  },
  created() {
    this.getFace(1, 10);
    this.getFaceList();

    this.$axios({
      method: "post",
      url: NEW_URL_CONFIG + "/api/config/select",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          sessionStorage.getItem("loginPrefix") +
          " " +
          sessionStorage.getItem("loginToken")
      },
      data: {
        configType: "Sys_004"
      }
    }).then(res => {
      if (res.data.statusCode == 200) {
        this.alcoholForm.alcoholCountryList = [];
        this.alcoholForm.alcoholUnitList = [];
        for (let i = 0; i < res.data.data.length; i++) {
          const ele = res.data.data[i];
          switch (ele.configId) {
            case 'JJUnit':
              this.alcoholForm.alcoholUnitList.push({
                value: ele.configValue,
                label: ele.configValue
              })
              break;
            case 'JJCountry':
              this.alcoholForm.alcoholCountryList.push({
                value: ele.configValue,
                label: ele.configValue
              })
              break;
            case 'JJStandard':
              this.alcoholForm.alcoholStandardList.push({
                value: ele.configValue,
                label: ele.configValue
              })
              break;

            default:
              break;""
          }

        }
        // console.log(res.data.data)

      } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
        this.$router.push({ path: "/login" });
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("common.logoutTitle")
        });
      }
    });
  },
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      this.faceQuery.faceUseList = [
        {
          value: true,
          label: this.$t("common.open")
        },
        {
          value: false,
          label: this.$t("common.close")
        }
      ];
    });
  }
};
</script>
<style lang="scss">
#config {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #faceConPage {
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
}
</style>
