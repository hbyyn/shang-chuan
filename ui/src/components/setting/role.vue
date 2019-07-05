<template>
  <div id="role">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="roleQuery">
      <el-form-item :label="$t('role.roleName')">
        <el-select v-model="dateQuery.role" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.roleList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addStaff">{{$t('common.add')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="roleTable" :data="roleData" border style="width:100%;" size="mini">
      <el-table-column prop="roleId" :label="$t('role.roleId')"></el-table-column>
      <el-table-column prop="roleName" :label="$t('role.roleName')"></el-table-column>
      <el-table-column prop="roleCreatetime" :label="$t('common.createTime')" width="180"></el-table-column>
      <el-table-column prop="roleCreator" :label="$t('common.creator')" width="180"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="handlePower(scope.$index, scope.row)">{{$t('role.powerEdit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="rolePage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog :title="roleVisibleTitle" :visible.sync="roleVisible" width="680px">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="120px" class="demo-roleForm">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('role.roleId')" prop="roleId">
              <el-input v-model="roleForm.roleId" v-if="roleForm.lookEdit" @blur="checkRoleId" :placeholder="$t('role.roleIdTitle')"></el-input>
              <el-input v-model="roleForm.roleId" v-else :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('role.roleName')" prop="roleName">
              <el-input v-model="roleForm.roleName" :placeholder="$t('role.roleNameTitle')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitRole('roleForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="roleVisible = false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('role.powerEdit')" :visible.sync="powerVisible" width="840px">

        <!-- :render-content="renderContent" show-checkbox -->
      <el-tree
        :data="powerTree"
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span style="font-size:14px;font-weight:bold;">{{ node.label }}</span>
          <!-- <span v-for="(item,index) in data.privileges" :key="index" @click.stop>
            {{item.privilegeName}}
          </span> -->
          <!-- <input type="checkbox" name="checkbox" id="" value='nihao'> -->
          <!-- <span v-for="(pri,j) in data.privileges" :key='j' class='input_list'>
            <label :class="{'is_checked':pri.isUse}" @click="checkToggle(node, data)"><span class='input_checked'></span><span class='input_title'>{{pri.privilegeName}}</span></label>
          </span> -->
          <el-checkbox v-for="(item,index) in data.privileges" :key="index" @click.self='func' v-model="item.isUse" style="margin:0px;">{{item.privilegeName}}</el-checkbox>
        </span>
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPower">{{$t('common.confirm')}}</el-button>
        <el-button @click="powerVisible = false">{{$t('common.cancel')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('role.powerEdit')" :visible.sync="powerVisible1" width="840px">
      <hj-tree :powerData='powerTree' :increment-conut='conut'></hj-tree>
    </el-dialog>
    <el-dialog :title="$t('role.powerEdit')" :visible.sync="powerVisible2" width="840px">
      <!-- <hj-tree :powerData='powerTree' :increment-conut='conut'></hj-tree> -->
      <ul class="powerDialog">
        <li>
          <ol>
            <li><h4>首页</h4></li>
            <li><el-checkbox v-model="powerData.h1019">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2089">统计</el-checkbox></li>
          </ol>
        </li>
        <!-- 在线 -->
        <li>
          <ol>
            <li><h4>在线视频</h4></li>
            <li><el-checkbox v-model="powerData.h1021">可见</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>在线巡逻</h4></li>
            <li><el-checkbox v-model="powerData.h1023">可见</el-checkbox></li>
          </ol>
        </li>
        <!-- 设备 -->
        <li>
          <ol>
            <li><h4>产品类型</h4></li>
            <li><el-checkbox v-model="powerData.h1016">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1032">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1026">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1028">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1029">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1030">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1031">编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>设备管理</h4></li>
            <li><el-checkbox v-model="powerData.h1024">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1011">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1002">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1004">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1012">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1013">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1014">编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>设备登录</h4></li>
            <li><el-checkbox v-model="powerData.h1033">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1041">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1034">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1036">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1038">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1039">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1040">编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>登录关系表</h4></li>
            <li><el-checkbox v-model="powerData.h1042">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1047">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1043">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1044">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1045">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1046">编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>设备用户</h4></li>
            <li><el-checkbox v-model="powerData.h1048">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1053">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1049">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1050">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1051">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1052">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1054">编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>用户关系表</h4></li>
            <li><el-checkbox v-model="powerData.h1055">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1060">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1056">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1057">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1058">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1059">编辑</el-checkbox></li>
          </ol>
        </li>

        <!-- 数据 -->
        <li>
          <ol>
            <li><h4>执法数据</h4></li>
            <li><el-checkbox v-model="powerData.h1062">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1065">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1064">下载文件</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1066">当前excel导出</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1067">全部excel导出</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>酒检数据</h4></li>
            <li><el-checkbox v-model="powerData.h1068">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1069">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1070">当前excel导出</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h1071">全部excel导出</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>人脸数据</h4></li>
            <li><el-checkbox v-model="powerData.h2002">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2005">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2003">当前excel导出</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2004">全部excel导出</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>酒检人脸数据</h4></li>
            <li><el-checkbox v-model="powerData.h2006">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2009">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2007">当前excel导出</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2008">全部excel导出</el-checkbox></li>
          </ol>
        </li>

        <li>
          <ol>
            <li><h4>毒检数据</h4></li>
            <li><el-checkbox v-model="powerData.h2010">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2014">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2011">当前excel导出</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2012">全部excel导出</el-checkbox></li>
          </ol>
        </li>

        <!-- 组织 -->
        <li>
          <ol>
            <li><h4>部门管理</h4></li>
            <li><el-checkbox v-model="powerData.h2016">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2021">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2017">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2018">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2020">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2019">编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>职员</h4></li>
            <li><el-checkbox v-model="powerData.h2022">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2028">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2023">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2026">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2025">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2027">批量删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2024">编辑</el-checkbox></li>
          </ol>
        </li>
        <!-- 统计 -->
        <li>
          <ol>
            <li><h4>人脸变更</h4></li>
            <li><el-checkbox v-model="powerData.h2030">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2031">查询</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>酒检变更</h4></li>
            <li><el-checkbox v-model="powerData.h2032">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2033">查询</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>硬件编号变更</h4></li>
            <li><el-checkbox v-model="powerData.h2034">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2035">查询</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>设备用户变更</h4></li>
            <li><el-checkbox v-model="powerData.h2036">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2037">查询</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>登录信息</h4></li>
            <li><el-checkbox v-model="powerData.h2038">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2039">查询</el-checkbox></li>
          </ol>
        </li>
        <!-- 设置 -->
        <li>
          <ol>
            <li><h4>管理员设置</h4></li>
            <li><el-checkbox v-model="powerData.h2041">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2045">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2042">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2043">编辑</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2044">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2046">角色查看</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2047">角色编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>角色设置</h4></li>
            <li><el-checkbox v-model="powerData.h2048">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2055">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2052">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2053">编辑</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2054">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2056">角色查看</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2057">角色编辑</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>设置</h4></li>
            <li><el-checkbox v-model="powerData.h2058">可见</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>人脸配置</h4></li>
            <li><el-checkbox v-model="powerData.h2065">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2072">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2066">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2070">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2068">编辑</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2069">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2071">批量删除</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>酒检配置</h4></li>
            <li><el-checkbox v-model="powerData.h2059">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2064">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2060">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2067">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2061">编辑</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2062">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2063">批量删除</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>地图设置</h4></li>
            <li><el-checkbox v-model="powerData.h2073">可见</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>二维码设置</h4></li>
            <li><el-checkbox v-model="powerData.h2074">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2076">查询</el-checkbox></li>
          </ol>
        </li>
        <li>
          <ol>
            <li><h4>公司设置</h4></li>
            <li><el-checkbox v-model="powerData.h2077">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2078">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2079">编辑</el-checkbox></li>
          </ol>
        </li>
        <!-- 帮助 -->

        <li>
          <ol>
            <li><h4>问题反馈</h4></li>
            <li><el-checkbox v-model="powerData.h2081">可见</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h20">查询</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2060">单个新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2067">批量新增</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2061">编辑</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2062">单个删除</el-checkbox></li>
            <li><el-checkbox v-model="powerData.h2063">批量删除</el-checkbox></li>
          </ol>
        </li>



      </ul>
    </el-dialog>
  </div>
</template>

<script>
import hjTree from '../common/hj_tree'
export default {
  data() {
    return {
      checked: true,
      conut: 0,
      defaultProps: {
        children: 'childNodes',
        label: 'operationName'
      },
      powerTree: [],
      dateQuery: {
        role: '',
        roleList: []
      },
      roleData: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      roleVisible: false,
      roleVisibleTitle: this.$t("common.add"),
      roleForm: {
        roleId: "",
        roleName: "",
        lookEdit: false
      },
      rules: {
        roleId: [
          {
            required: true,
            message: this.$t("role.roleIdTitle"),
            trigger: "change"
          }
        ],
        roleName: [
          {
            required: true,
            message: this.$t("role.roleNameTitle"),
            trigger: "change"
          }
        ]
      },
      powerVisible: false,
      powerVisible1: false,
      powerVisible2: false,
      powerData: {
        //首页
        h1019: false,
        h2089: false,
        //在线
        h1021: false,
        h1023:false,
        //产品类型
        h1016: false,
        h1032: false,
        h1026: false,
        h1028: false,
        h1029: false,
        h1030: false,
        h1031: false,
        //设备管理
        h1024: false,
        h1011: false,
        h1002: false,
        h1004: false,
        h1012: false,
        h1013: false,
        h1014: false,
        //设备登录
        h1033: false,
        h1041: false,
        h1034: false,
        h1036: false,
        h1038: false,
        h1039: false,
        h1040: false,
        //登录关系表
        h1042: false,
        h1047: false,
        h1043: false,
        h1044: false,
        h1045: false,
        h1046: false,
        //设备用户
        h1048: false,
        h1053: false,
        h1049: false,
        h1050: false,
        h1051: false,
        h1052: false,
        h1054: false,
        //用户关系表
        h1055: false,
        h1060: false,
        h1056: false,
        h1057: false,
        h1058: false,
        //执法数据
        h1062: false,
        h1065: false,
        h1064: false,
        h1066: false,
        h1067: false,
        //酒检数据
        h1068: false,
        h1069: false,
        h1070: false,
        h1071: false,
        //人脸数据
        h2002: false,
        h2005: false,
        h2003: false,
        h2004: false,
        //酒检人脸数据
        h2006: false,
        h2009: false,
        h2007: false,
        h2008: false,
        //毒检数据
        h2010: false,
        h2014: false,
        h2011: false,
        h2012: false,
        //部门管理
        h2016: false,
        h2021: false,
        h2017: false,
        h2018: false,
        h2020: false,
        h2019: false,
        //职员
        h2022: false,
        h2028: false,
        h2023: false,
        h2026: false,
        h2025: false,
        h2027: false,
        h2024: false,
        //人脸变更
        h2030: false,
        h2031: false,
        //酒检变更
        h2032: false,
        h2033: false,
        //硬件编号变更
        h2034: false,
        h2035: false,
        //设备用户变更
        h2036: false,
        h2037: false,
        //登录信息
        h2038: false,
        h2039: false,
        //管理员设置
        h2041: false,
        h2045: false,
        h2042: false,
        h2043: false,
        h2044: false,
        h2046: false,
        h2047: false,
        //角色设置
        h2048: false,
        h2055: false,
        h2052: false,
        h2053: false,
        h2054: false,
        h2056: false,
        h2057: false,
        //设置
        h2058: false,
        //人脸配置
        h2065: false,
        h2072: false,
        h2066: false,
        h2070: false,
        h2068: false,
        h2069: false,
        h2071: false,
        // 酒检配置
        h2059: false,
        h2064: false,
        h2060: false,
        h2067: false,
        h2061: false,
        h2062: false,
        h2063: false,
        // 地图设置
        h2073: false,
        //二维码设置
        h2074: false,
        h2076: false,
        //公司设置
        h2077: false,
        h2078: false,
        h2079: false,






      }
    };
  },
  components: {
    hjTree
  },
  methods: {
    checkToggle(node, data){
      console.log(node, data)
    },
    func(){
      console.log(1)
    },
    func1(){
      console.log(2)
    },
    //获取管理员设置列表
    getRole(pageIndex, pageSize, roleId) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/webrole/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("rolePrefix") +
            " " +
            sessionStorage.getItem("roleToken")
        },
        data: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          roleId: roleId
        }
      })
        .then(res => {
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.roleData = [];
            this.total = res.data.data.count;
            res.data.data.resultObjects.forEach(val => {
              this.roleData.push({
                roleId: val.roleId,
                roleName: val.roleName,
                roleCreatetime: val.roleCreatetime,
                roleCreator: val.roleCreator
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
    //检索
    onSubmit() {
      this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
    },
    //验证用户编号
    checkRoleId() {
      if (!this.roleForm.roleId) {
        return false;
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/webrole/check/" + this.roleForm.roleId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("rolePrefix") +
            " " +
            sessionStorage.getItem("roleToken")
        },
        params: this.roleForm.roleId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.roleForm.roleId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("role.checkRoleId")
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
    //新增角色
    addStaff() {
      this.roleVisible = true;
      this.roleVisibleTitle = this.$t("common.add");
      this.roleForm.lookEdit = true;
      this.roleForm.roleId = "";
      this.roleForm.roleName = "";
      this.$nextTick(()=>{
        this.$refs.roleForm.clearValidate();
      });
    },
    //编辑角色
    handleEdit(index, row) {
      this.roleVisible = true;
      this.roleVisibleTitle = this.$t("common.look");
      this.roleForm.lookEdit = false;
      this.roleForm.roleId = row.roleId;
      this.roleForm.roleName = row.roleName;
    },
    //编辑权限
    handlePower(index,row){
      this.powerVisible2 = true;
      // return false
      // this.powerVisible = true;
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/webrwebp/select",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "roleId": row.roleId
        }
      }).then(res=>{
        console.log(res)
        return false
        if(res.data.statusCode == 200){
          this.powerTree = res.data.data.resultObjects[0].privilegeModels[0].childNodes;
          console.log(res.data.data.resultObjects[0].privilegeModels[0].childNodes);
          let b = [];
          for (let i = 0; i < res.data.data.resultObjects[0].privilegeModels[0].childNodes.length; i++) {
            const eleI = res.data.data.resultObjects[0].privilegeModels[0].childNodes[i];
            for (let j = 0; j < eleI.childNodes.length; j++) {
              const eleJ = eleI.childNodes[j];
              b.push(eleJ.privileges)
              if(eleJ.childNodes&&eleJ.childNodes.length){
                for (let k = 0; k < eleJ.childNodes.length; k++) {
                  const eleK = eleJ.childNodes[k];
                  b.push(eleK.privileges)
                }
              }
            }
          }
          console.log(b)
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
    //删除角色
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("role.role") +
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
            url: NEW_URL_CONFIG + "/api/webrole/delete/" + row.roleId,
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization:
                sessionStorage.getItem("rolePrefix") +
                " " +
                sessionStorage.getItem("roleToken")
            },
            data: ''
          })
            .then(res => {
              if (res.data.statusCode == 200) {
                if (this.roleData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
                } else {
                  this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
                }
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.addSuccessTitle")
                });
                this.roleVisible = false;
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
              } else if ( res.data.statusCode == 202 ) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("role.delErrorTitle")
                });
              } else if ( res.data.statusCode == 403001 ) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("role.adminDelTip")
                });
              }
            })
            .catch(res => {
              // console.log(res)
            });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: "info",
            message: this.$t("common.canceledDeletion")
          });
        });
      // console.log(row)
    },
    //新增、编辑的保存
    submitRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.roleForm.lookEdit) {
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/webrole/add/single",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("rolePrefix") +
                  " " +
                  sessionStorage.getItem("roleToken")
              },
              data: {
                roleId: this.roleForm.roleId,
                roleName: this.roleForm.roleName
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.roleVisible = false;
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
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/webrole/edit",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("rolePrefix") +
                  " " +
                  sessionStorage.getItem("roleToken")
              },
              data: {
                roleId: this.roleForm.roleId,
                roleAcode: this.roleForm.roleAcode,
                roleName: this.roleForm.roleName
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  let start = '', end = '';
                  if(this.startTime){
                    start = this.startTime.toString().split('GMT')[0];
                  }
                  if(this.endTime){
                    end = this.endTime.toString().split('GMT')[0];
                  }
                  this.getRole(this.currentPage, this.pageTotal, this.dateQuery.role);
                  this.roleVisible = false;
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
    //编辑权限
    submitPower(){
      this.powerVisible = false;
    },
    pageResize() {
      this.$nextTick(() => {
        // var app = document.getElementById('app');
        var role = document.getElementById("role");
        var roleQuery = document.getElementById("roleQuery");
        var roleTable = document.getElementById("roleTable");
        var rolePage = document.getElementById("rolePage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          rolePage.style.width = roleTable.clientWidth - 11 + "px";
          rolePage.style.paddingLeft = "25px";
          rolePage.style.paddingRight = "25px";
          rolePage.style.marginLeft = -rolePage.offsetWidth / 2 + "px";
          rolePage.style.position = "fixed";
          this.active = true;
        } else {
          rolePage.style.paddingLeft = "5px";
          rolePage.style.position = "static";
          rolePage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  created() {},
  mounted() {
    this.$axios({
      method: "post",
      url: NEW_URL_CONFIG + "/api/webrole/select/base",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          sessionStorage.getItem("rolePrefix") +
          " " +
          sessionStorage.getItem("roleToken")
      },
      data: {
        pageIndex: 1,
        pageSize: 99999
      }
    })
      .then(res => {
        console.log(res)
        if (res.data.statusCode == 200) {
          this.dateQuery.roleList = [];
          res.data.data.resultObjects.forEach(val => {
            this.dateQuery.roleList.push({
              value: val.roleId,
              label: val.roleName
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
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        roleId: [
          {
            required: true,
            message: this.$t("role.roleIdTitle"),
            trigger: "change"
          }
        ],
        roleName: [
          {
            required: true,
            message: this.$t("role.roleNameTitle"),
            trigger: "change"
          }
        ]
      };
    });
    let _this = this;
    _this.getRole(1, 10);
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
.powerDialog{
  li{
    ol{
      overflow: hidden;
      li{
        float: left;
        margin-left: 20px;
        h4{
          margin: 0px 5px 0px 0px;
        }
      }
    }
  }
}
#role {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #rolePage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);
    &.activeBackground {
      background-color: #fff;
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
}
</style>
