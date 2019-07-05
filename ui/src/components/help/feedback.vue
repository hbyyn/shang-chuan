<template>
  <div id="feedback">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="feedbackQuery">
      <div></div>
      <el-form-item :label="$t('feedback.questionType')">
        <el-select v-model="dateQuery.type" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="itme in dateQuery.typeList" :key="itme.value" :label="itme.label" :value="itme.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="danger" @click="delBatch">{{$t('common.deleteBatch')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addFeedback">{{$t('common.add')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="feedbackTable" :data="feedbackData" border style="width:100%;" size="mini" @selection-change="handleSelection">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="questionSubject" :label="$t('feedback.questionSubject')"></el-table-column>
      <el-table-column prop="questionTime" :label="$t('feedback.questionTime')" width="135"></el-table-column>
      <el-table-column prop="questionType" :label="$t('feedback.questionType')" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.questionType=='personal'">{{$t('feedback.individualOpinion')}}</span>
          <span v-else-if="scope.row.questionType=='production'">{{$t('feedback.productProblems')}}</span>
          <span v-else>{{$t('feedback.usageProblems')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="questionEmail" :label="$t('feedback.questionEmail')" width="140"></el-table-column>
      <el-table-column prop="questionPhone" :label="$t('feedback.questionPhone')" width="130"></el-table-column>
      <el-table-column prop="questionReceiver" :label="$t('feedback.questionReceiver')" width="110"></el-table-column>
      <el-table-column prop="questionReceiveTime" :label="$t('feedback.questionReceiveTime')" width="130"></el-table-column>
      <el-table-column prop="questionReceiverEmail" :label="$t('feedback.questionReceiverEmail')" width="140"></el-table-column>
      <el-table-column prop="questionReceiverPhone" :label="$t('feedback.questionReceiverPhone')" width="130"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.questionBool">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="primary" @click="handleAccept(scope.$index, scope.row)">{{$t('common.accept')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="feedbackPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total" ></el-pagination>
    <el-dialog :title="feedbackVisibleTitle" :visible.sync="feedbackVisible" width="960px" @close="closeFeeback">
      <el-form :model="feedbackForm" :rules="rules" ref="feedbackForm" label-width="100px" class="demo-feedbackForm" >
        <el-form-item :label="$t('feedback.questionSubject')" prop="title">
          <el-input v-model="feedbackForm.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('feedback.questionContent')" prop="content">
          <el-upload class="avatar-uploader" style="height:0px;" :action="actionUrl" accept="image/jpeg" :data="imgType" :headers="headerdate" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload" ></el-upload>
          <!--富文本编辑器组件-->
          <el-row v-loading="quillUpdateImg">
            <quill-editor style="border-radius: 4px;" v-model="feedbackForm.content" ref="myQuillEditor" :options="feedbackForm.editorOption" ></quill-editor>
          </el-row>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('feedback.uploadAttachment')">
              <el-upload class = "upload-demo" ref = "upload" :action = "actionUrl" :data = "fileType" :headers = "headerdate" :file-list = "feedbackForm.fileList" :on-success = "uploadFileSuccess" :on-error = "uploadFileError" :before-upload = "beforeFileUpload" :on-remove = "removeFile" :on-exceed = "exceedFile" :limit = '5'>
                <div style="width:100%;">
                  <i class="el-icon-upload" style="float:left;width:32px;height:22px;padding-top:5px;font-size:22px;"></i>
                  <div slot="tip" style="float:left;margin-top:0px;" class="el-upload__tip">{{$t('feedback.attachmentLimit')}}</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('feedback.questionType')" prop="type">
              <el-select v-model="feedbackForm.type">
                <el-option v-for="itme in dateQuery.typeList" :key="itme.value" :label="itme.label" :value="itme.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('feedback.questionEmail')">
              <el-input v-model.trim="feedbackForm.email" :placeholder="$t('feedback.emailTitle1')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('feedback.questionPhone')">
              <el-input v-model.trim="feedbackForm.phone" :placeholder="$t('feedback.phoneTitle')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('feedbackForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="feedbackVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="acceptVisibleTitle" :visible.sync="acceptVisible" width="720px">
      <el-form :model="acceptFrom" :rules="rules1" ref="acceptFrom" label-width="120px">
        <el-form-item :label="$t('feedback.questionReceiver')" prop="questionReceiver">
          <el-input v-model="acceptFrom.questionReceiver" :placeholder="$t('feedback.questionReceiverTitle')" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('feedback.questionReceiveTime')" prop="questionReceiveTime">
          <el-date-picker v-model="acceptFrom.questionReceiveTime" type="datetime" :placeholder="$t('feedback.questionReceiveTimeTitle')" style="width:560px;"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('feedback.questionReceiverEmail')">
          <el-input v-model="acceptFrom.questionReceiverEmail" :placeholder="$t('feedback.questionReceiverEmailTitle')" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('feedback.questionReceiverPhone')">
          <el-input v-model="acceptFrom.questionReceiverPhone" :placeholder="$t('feedback.questionReceiverPhoneTitle')" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="acceptForm('acceptFrom')">{{$t('common.confirm')}}</el-button>
          <el-button @click="acceptVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import myValidate from '../../api/myValidate'
import common from '../../api/common.js'
// 工具栏配置
const toolbarOptions = [
  ['clean', {'header': [1, 2, 3, 4, 5, 6, false]}, 'bold', 'italic', 'underline', 'code-block', {'list': 'ordered'}, {'list': 'bullet'},'image', {'color': []}, {'background': []}]
];
export default {
  data() {
    return {
      time: '',
      //表格里选中的数据
      selection: [],
      typeDisabled: true,
      dateQuery: {
        type: "",
        typeList: [
          {
            label: this.$t("feedback.individualOpinion"),
            value: "personal"
          },
          {
            label: this.$t("feedback.productProblems"),
            value: "production"
          },
          {
            label: this.$t("feedback.usageProblems"),
            value: "question"
          }
        ]
      },
      feedbackData: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      feedbackVisible: false,
      feedbackVisibleTitle: this.$t("common.accept"),
      imgType: {
        targetEnum: "QuestionFile"
      },
      fileType: {
        targetEnum: "Enclosure"
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      actionUrl: NEW_URL_CONFIG + "/api/file/upload",  // 这里写你要上传的图片服务器地址
      headerdate: {},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      feedbackForm: {
        uploadBool: false,
        addEdit: true, //true表示新增，false表示编辑
        questionId: "",
        title: "",
        // time: '',
        type: "",
        email: "",
        phone: "",
        fileList: [],
        content: "",
        editorOption: {
          placeholder: this.$t("feedback.contentTitle"),
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    // alert(1)
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        },
        //问题反馈信息弹窗的是编辑还是查看 false示编辑true表示查看
        lookEdit: false
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t("feedback.titleTitle"),
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: this.$t("feedback.typeTitle"),
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: this.$t("feedback.emailTitle1"),
            trigger: "change"
          },
          {
            type: "email",
            message: this.$t("feedback.emailTitle2"),
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("feedback.phoneTitle"),
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: this.$t("feedback.contentTitle"),
            trigger: "change"
          }
        ]
      },
      acceptVisible: false,
      acceptVisibleTitle: this.$t("common.add"),
      acceptFrom: {
        questionId: "",
        questionReceiver: "",
        questionReceiveTime: "",
        questionReceiverEmail: "",
        questionReceiverPhone: ""
      },
      rules1: {
        questionReceiver: [
          {
            required: true,
            message: this.$t("feedback.questionReceiverTitle"),
            trigger: "change"
          }
        ],
        questionReceiveTime: [
          {
            required: true,
            message: this.$t("feedback.questionReceiveTimeTitle"),
            trigger: "change"
          }
        ],
        questionReceiverEmail: [
          {
            required: true,
            message: this.$t("feedback.questionReceiverEmailTitle"),
            trigger: "change"
          },
          {
            type: "email",
            message: this.$t("feedback.emailTitle2"),
            trigger: ["blur", "change"]
          }
        ],
        questionReceiverPhone: [
          {
            required: true,
            message: this.$t("feedback.questionReceiverPhoneTitle"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    //上传图片是图片格式和大小验证
    beforeUpload(file) {
      // 显示loading动画
      this.quillUpdateImg = true
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension1 = fileName[fileName.length - 1] === "jpg";
      const extension2 = fileName[fileName.length - 1] === "png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension1 && !extension2) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.imgType"),
          type: "warning"
        });
        this.quillUpdateImg = false
      }
      if (!isLt2M) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.imgSize"),
          type: "warning"
        });
        this.quillUpdateImg = false
      }
      return (extension1 || extension2) && isLt2M;
    },
    //富文本图片上传成功
    uploadSuccess(res, file) {
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.statusCode == '200' && res.data.length) {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', res.data[0].fileUrl)
          // 调整光标到最后
          quill.setSelection(length + 1)
          let imgs = document.getElementsByClassName('ql-editor')[0].getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            imgs[i].setAttribute('width','320')
          }
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('common.imgFail'),
          type: "warning"
        });
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message({
        showClose: true,
        duration: 2000,
        message: this.$t('common.imgFail'),
        type: "warning"
      });
    },

    //上传附件是附件大小验证
    beforeFileUpload(file){
      var fileName = new Array();
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.fileSize"),
          type: "warning"
        });
      }
      return isLt2M;
    },
    //上传附件成功
    uploadFileSuccess(res){
      if(res.statusCode=='200' && res.data.length){
        this.$set(this.feedbackForm.fileList,this.feedbackForm.fileList.length,{
          name: res.data[0].fileName,
          url: res.data[0].fileUrl
        });
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t('common.fileFail'),
          type: "warning"
        });
      }
    },
    //上传附件失败
    uploadFileError(file){
      this.$message({
        showClose: true,
        duration: 2000,
        message: this.$t('common.fileFail'),
        type: "warning"
      });
    },
    //移除附件
    removeFile(file,fileList){
      this.feedbackForm.fileList = fileList;
    },
    //附件上传到达上限
    exceedFile(){
      this.$message({
        showClose: true,
        duration: 2000,
        message: this.$t("feedback.attachmentLimit"),
        type: "warning"
      });
    },
    //获取列表数据
    getFeedback(pageIndex, pageSize, questionType) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/webquestion/select",
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
          questionType: questionType
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.feedbackData = [];
            res.data.data.resultObjects.forEach(val => {
              let bool = val.questionReceiver ? true : false;
              this.feedbackData.push({
                questionId: val.questionId,
                questionSubject: val.questionSubject,
                questionContent: val.questionContent,
                questionType: val.questionType,
                questionEmail: val.questionEmail,
                questionPhone: val.questionPhone,
                questionCreator: val.questionCreator,
                questionCreateTime: val.questionCreateTime,
                questionTime: val.questionTime,
                questionReceiver: val.questionReceiver,
                questionReceiveTime: val.questionReceiveTime,
                questionReceiverPhone: val.questionReceiverPhone,
                questionReceiverEmail: val.questionReceivereMail,
                questionBool: bool,
                questionDtls: val.questionDtls
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
    //表格选择事件
    handleSelection(val) {
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push(val[i].questionId);
        }
      }
    },

    //按条件检索
    onSubmit() {
      this.getFeedback(1, this.pageTotal, this.dateQuery.type);
    },

    //新增问题反馈
    addFeedback() {
      this.feedbackVisible = true;
      this.time = common.time();
      this.feedbackForm.addEdit = true;
      this.feedbackVisibleTitle = this.$t("common.add");
      this.feedbackForm.questionId = "";
      this.feedbackForm.title = this.$t("feedback.usageProblems") + " " + this.time;
      this.feedbackForm.type = "question";
      this.feedbackForm.email = "";
      this.feedbackForm.phone = "";
      this.feedbackForm.fileList = [];
      this.feedbackForm.content = "";
      this.$nextTick(()=>{
        this.$refs.feedbackForm.clearValidate();
      });
    },

    //编辑问题反馈
    handleEdit(index, row) {
      this.feedbackVisible = true;
      this.feedbackForm.addEdit = false;
      this.time = common.time();
      this.feedbackVisibleTitle = this.$t("common.edit") + this.$t("feedback.feedback");
      this.feedbackForm.questionId = row.questionId;
      this.feedbackForm.title = row.questionSubject;
      this.feedbackForm.type = row.questionType;
      this.feedbackForm.email = row.questionEmail;
      this.feedbackForm.phone = row.questionPhone;
      this.feedbackForm.content = row.questionContent;
      for (let i = 0; i < row.questionDtls.length; i++) {
        this.$set(this.feedbackForm.fileList,i,{
          name: row.questionDtls[i].questionDtlFile,
          url: row.questionDtls[i].questionDtlPath
        })
      };
    },

    //受理
    handleAccept(index, row) {
      // console.log(row)
      this.acceptVisible = true;
      this.acceptVisibleTitle = this.$t("common.accept") + this.$t("feedback.feedback");
      this.acceptFrom.questionId = row.questionId;
      this.acceptFrom.questionReceiver = row.questionReceiver;
      this.acceptFrom.questionReceiveTime = row.questionReceiveTime;
      this.acceptFrom.questionReceiverEmail = row.questionReceiverEmail;
      this.acceptFrom.questionReceiverPhone = row.questionReceiverPhone;
      if(!row.questionReceiver){
        this.$nextTick(()=>{
          this.$refs.acceptFrom.clearValidate();
        });
      }
    },

    //删除问题反馈
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("feedback.feedback") +
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
            url: NEW_URL_CONFIG + "/api/webquestion/delete/" + row.questionId,
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
                if (
                  this.feedbackData.length == "1" &&
                  this.currentPage != "1"
                ) {
                  this.currentPage = this.currentPage - 1;
                  this.getFeedback(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.type
                  );
                } else {
                  this.getFeedback(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.type
                  );
                }
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.delSuccessTitle")
                });
              } else if (res.data.statusCode == 402) {
                this.$router.push({ path: "/login" });
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("common.logoutTitle")
                });
              } else if (res.data.statusCode == 201) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("feedback.delErrorTitle")
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
    //批量删除
    delBatch() {
      if (this.selection.length) {
        this.$confirm(
          this.$t("common.delTitleTips1") +
            this.$t("feedback.feedback") +
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
              url: NEW_URL_CONFIG + "/api/webquestion/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                "questionIds": this.selection
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (
                    this.feedbackData.length == "1" &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getFeedback(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.type
                    );
                  } else {
                    this.getFeedback(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.type
                    );
                  }
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.delSuccessTitle")
                  });
                } else if (res.data.statusCode == 402) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("common.logoutTitle")
                  });
                } else if (res.data.statusCode == 201) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("feedback.delErrorTitle")
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
          message: this.$t("feedback.delNullTitle")
        });
        return false;
      }
    },
    //关闭feedback弹窗回调
    closeFeeback(){
      this.feedbackForm.questionId = "";
      this.feedbackForm.email = "";
      this.feedbackForm.phone = "";
      this.feedbackForm.fileList = [];
      this.feedbackForm.content = "";
    },
    //提交新增或编辑
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if ((this.feedbackForm.email && !myValidate.email(this.feedbackForm.email))) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.emailTitle"),
              duration: 2000
            });
            return false;
          } else if((this.feedbackForm.phone && !myValidate.phone(this.feedbackForm.phone))){
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.phoneTitle"),
              duration: 2000
            });
            return false;
          }else if(!this.feedbackForm.email&&!this.feedbackForm.phone) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("feedback.emailPhone"),
              duration: 2000
            });
            return false;
          }
          let attachmentsData = []
          for (let i = 0; i < this.feedbackForm.fileList.length; i++) {
            this.$set(attachmentsData,i,{
              "questionDtlFile": this.feedbackForm.fileList[i].name,
              "questionDtlPath": this.feedbackForm.fileList[i].url,
            })
          }
          let questionSubject = '';
          let questionPhone = '';
          let questionEmail = '';
          if(this.feedbackForm.title){
            questionSubject = this.feedbackForm.title.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          if(this.feedbackForm.phone){
            questionPhone = this.feedbackForm.phone.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          if(this.feedbackForm.email){
            questionEmail = this.feedbackForm.email.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          let postData = {
            'questionSubject': questionSubject,
            'questionContent': this.feedbackForm.content,
            'questionType': this.feedbackForm.type,
            'questionPhone': questionPhone,
            'questionEmail': questionEmail,
            'questionTime': this.time
          };
          if(attachmentsData.length){
            postData['questionDtls'] = attachmentsData;
          }
          if (this.feedbackForm.addEdit) {
            //表示新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/webquestion/add",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: [postData]
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  this.getFeedback(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.type
                  );
                  this.feedbackVisible = false;
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
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
                }
              })
              .catch(res => {
                // console.log(res)
              });
          } else {
            postData["questionId"] = this.feedbackForm.questionId;
            //表示编辑的保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/webquestion/edit",
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
                  this.getFeedback(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.type
                  );
                  this.feedbackVisible = false;
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
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
                }
              })
              .catch(res => {
                // console.log(res)
              });
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },

    //提交受理
    acceptForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.acceptFrom.questionReceiverPhone&&(this.acceptFrom.questionReceiverEmail&&!/\w+@\w+\.[a-z]+(\.[a-z]+)?/.test(this.acceptFrom.questionReceiverEmail))){
            this.acceptFrom.questionReceiverPhone = this.acceptFrom.questionReceiverPhone.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
            this.acceptFrom.questionReceiverEmail = this.acceptFrom.questionReceiverEmail.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          } else if(this.acceptFrom.questionReceiverPhone&&!this.acceptFrom.questionReceiverEmail){
            this.acceptFrom.questionReceiverPhone = this.acceptFrom.questionReceiverPhone.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
            this.acceptFrom.questionReceiverEmail = '';
          } else if ( !this.acceptFrom.questionReceiverPhone&&(this.acceptFrom.questionReceiverEmail&&!/\w+@\w+\.[a-z]+(\.[a-z]+)?/.test(this.acceptFrom.questionReceiverEmail))) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.emailTitle"),
              duration: 2000
            });
            return false;
          } else if ( !this.acceptFrom.questionReceiverPhone&&(this.acceptFrom.questionReceiverEmail&&/\w+@\w+\.[a-z]+(\.[a-z]+)?/.test(this.acceptFrom.questionReceiverEmail))) {
            this.acceptFrom.questionReceiverPhone = '';
            this.acceptFrom.questionReceiverEmail = this.acceptFrom.questionReceiverEmail.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          } else if(!this.acceptFrom.questionReceiverEmail&&!this.acceptFrom.questionReceiverPhone) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("feedback.emailPhone"),
              duration: 2000
            });
            return false;
          }
          let questionReceiver = '';
          // let questionReceiveTime = '';
          if(this.acceptFrom.questionReceiver){
            questionReceiver = this.acceptFrom.questionReceiver.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          // if(this.acceptFrom.questionReceiveTime){
          //   questionReceiveTime = this.acceptFrom.questionReceiveTime.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          // }
          let postData = {
            'questionId': this.acceptFrom.questionId,
            'questionReceiver': questionReceiver,
            'questionReceiveTime': this.acceptFrom.questionReceiveTime,
            'questionReceiverEmail': this.acceptFrom.questionReceiverEmail,
            'questionReceiverPhone': this.acceptFrom.questionReceiverPhone
          };
          //表示编辑的保存
          this.$axios({
            method: "put",
            url: NEW_URL_CONFIG + "/api/webquestion/receiver/edit",
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
                this.getFeedback(
                  this.currentPage,
                  this.pageTotal,
                  this.dateQuery.type
                );
                this.acceptVisible = false;
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.editSuccessTitle")
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
              }
            })
            .catch(res => {
              // console.log(res)
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },

    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      this.getFeedback(this.currentPage, this.pageTotal, this.dateQuery.type);
    },

    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getFeedback(this.currentPage, this.pageTotal, this.dateQuery.type);
    },

    //适配界面
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var feedback = document.getElementById("feedback");
        var feedbackQuery = document.getElementById("feedbackQuery");
        var feedbackTable = document.getElementById("feedbackTable");
        var feedbackPage = document.getElementById("feedbackPage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          feedbackPage.style.width = feedbackTable.clientWidth - 11 + "px";
          feedbackPage.style.paddingLeft = "25px";
          feedbackPage.style.paddingRight = "25px";
          feedbackPage.style.marginLeft = -feedbackPage.offsetWidth / 2 + "px";
          feedbackPage.style.position = "fixed";
          this.active = true;
        } else {
          feedbackPage.style.paddingLeft = "5px";
          feedbackPage.style.position = "static";
          feedbackPage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      (this.rules = {
        title: [
          {
            required: true,
            message: this.$t("feedback.titleTitle"),
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: this.$t("feedback.typeTitle"),
            trigger: "change"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "change" },
          {
            type: "email",
            message: this.$t("feedback.emailTitle"),
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("feedback.phoneTitle"),
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: this.$t("feedback.contentTitle"),
            trigger: "change"
          }
        ]
      }),
        (this.rules1 = {
          questionReceiver: [
            {
              required: true,
              message: this.$t("feedback.questionReceiverTitle"),
              trigger: "change"
            }
          ],
          questionReceiveTime: [
            {
              required: true,
              message: this.$t("feedback.questionReceiveTimeTitle"),
              trigger: "change"
            },
            {
              type: "email",
              message: this.$t("feedback.emailTitle2"),
              trigger: ["blur", "change"]
            }
          ],
          questionReceiverEmail: [
            {
              required: true,
              message: this.$t("feedback.questionReceiverEmailTitle"),
              trigger: "change"
            }
          ],
          questionReceiverPhone: [
            {
              required: true,
              message: this.$t("feedback.questionReceiverPhoneTitle"),
              trigger: "change"
            }
          ]
        });
    });
    let _this = this;
    _this.getFeedback(1, 10);
    _this.pageResize();
    window.onresize = () => {
      _this.pageResize();
    };
  },
  created(){
    //上传文件时验证用户的状态码
    this.headerdate = {
      Authorization:
        sessionStorage.getItem("loginPrefix") +
        " " +
        sessionStorage.getItem("loginToken")
    };
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="scss">
#feedback {
  .ql-snow .ql-picker-label::before{
    position: absolute;
  }
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #feedbackPage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);
    &.activeBackground {
      background-color: #fff;
    }
  }
  .ql-toolbar {
    border-radius: 4px 4px 0px 0px;
    padding: 4px 8px;
  }
  .ql-container {
    border-radius: 0px 0px 4px 4px;
    .ql-editor {
      min-height: 240px;
      max-height: 360px;
    }
  }
  .feedbackTable {
    .el-input.is-disabled {
      .el-input__inner {
        background-color: transparent;
        border-color: transparent;
        color: #606266;
        cursor: default;
      }
    }
    .el-input__suffix {
      display: none;
    }
  }
}
</style>

