<template>
	<div class="onlineBox">
		<div class="sidebar">
			<div class="tree">
				<div class="tree-search-box">
					<el-autocomplete v-model="treeSearchState" :fetch-suggestions="querySearchAsync" :placeholder="$t('onLine.inputTips')"
					 @select="handleSelect" prefix-icon="el-icon-search"></el-autocomplete>
				</div>
				<el-scrollbar ref="myTreeChartScrollbar" :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle=""
				 :noresize="false" tag="section">
					<div class="xh-tree well">
						<ul>
							<xhTree @noticeServicePlayStopVideo-a="noticeServicePlayStopVideo" @openDialogMessge-a="openDialogMessge"
							 @loadLanYaMesg-a="loadLanYaMesg" @location-a="location" @mapsCheckRoter-a="mapsCheckRoter" @mapsSetRoutePop-a="mapsSetRoutePop"
							 @mapsBindClick-a="mapsBindClick" @clickSendMachine-a="clickSendMachine" @clickJiQi-a="clickJiQi" :model="serverData"
							 :pageItem="pageItem"></xhTree>
						</ul>
					</div>
				</el-scrollbar>
			</div>
			<div class="handle">
				<div class='handleBox'>
					<div class='handleBoxClick' @click="toggleSider"><i class='iconfont' :class="{'well-4g-icon-icon_on_the_right': !toggleArrow ,'well-4g-icon-icon-arrow-left2': toggleArrow  }"></i></div>
				</div>
			</div>
		</div>
		<div class="sidebarRight">
			<div v-show="pageItem===0">
				<el-row type="flex" justify="space-around">
					<el-col :span="12">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="card-title clearfix">
								{{DataNo[0]}}
							</div>
							<div class="video-box" :style="{height:videoHeight}" id="CuPlayer0"></div>
						</el-card>
					</el-col>
					<el-col :span="12">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="card-title clearfix">
								{{DataNo[1]}}
							</div>
							<div class="video-box" :style="{height:videoHeight}" id="CuPlayer1"></div>
						</el-card>
					</el-col>
				</el-row>
				<el-row type="flex" justify="space-around">
					<el-col :span="12">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="card-title clearfix">
								{{DataNo[2]}}
							</div>
							<div class="video-box" :style="{height:videoHeight}" id="CuPlayer2"></div>
						</el-card>
					</el-col>
					<el-col :span="12">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="card-title clearfix">
								{{DataNo[3]}}
							</div>
							<div class="video-box" :style="{height:videoHeight}" id="CuPlayer3"></div>
							<!-- <video :src="demo1" controls></video> -->
						</el-card>
					</el-col>
				</el-row>
				<el-dialog :visible.sync="dialogLanYaMessge" width="60%">
					<span>
						<el-table :data="dialogLanYaMessgeTableData[LanYaDataNo]" height="400" border style="width: 100%">
							<el-table-column prop="text" :label="$t('onLine.alcoholContent')" width="180">
							</el-table-column>
							<el-table-column prop="time" :label="$t('onLine.time')" width="250">
							</el-table-column>
							<el-table-column prop="face" :label="$t('onLine.face')" width="180">
							</el-table-column>
							<el-table-column prop="img" :label="$t('onLine.img')">
								<template slot-scope="scope">
									<viewer :images="[scope.row.img]">
										<img v-if="scope.row.img" :src="scope.row.img" class="dialog-jj-img" />
									</viewer>
									<!-- <img v-if="scope.row.img" :src="scope.row.img" class="dialog-jj-img" @click="imageEnlarge(scope.row.img)" /> -->
								</template>
							</el-table-column>
						</el-table>
					</span>
					<span slot="title">
						{{$t('onLine.bluetooth')+$t('onLine.newsList')}}
					</span>
				</el-dialog>
				<el-dialog :title="$t('onLine.newsList')" :visible.sync="dialogMessge" width="55%" custom-class="dialog-messge-box">
					<el-row>
						<el-col :span="8">
							<el-collapse v-model="activeDialogMessgeName" accordion>
								<el-collapse-item :title="$t('onLine.file')" name="1">
									<ul class="dialog-messge-ul">
										<ul class="dialog-messge-ul">
											<li v-for="(item,index) in dialogMessgeFileData[fileDataNo]" @click="dialogMessgeOpenFile('path1',item.path)"
											 :key="index">{{item.name}}</li>
										</ul>
									</ul>
								</el-collapse-item>
								<el-collapse-item :title="$t('onLine.audio')" name="2">
									<ul class="dialog-messge-ul">
										<ul class="dialog-messge-ul">
											<li v-for="(item,index) in dialogMessgeAudioData[fileDataNo]" @click="dialogMessgeOpenFile('path2',item.path)"
											 :key="index">{{item.name}}</li>
										</ul>
									</ul>
								</el-collapse-item>
								<el-collapse-item :title="$t('onLine.video')" name="3">
									<ul class="dialog-messge-ul">
										<li v-for="(item,index) in dialogMessgeVideoData[fileDataNo]" @click="dialogMessgeOpenFile('path3',item.path)"
										 :key="index">{{item.name}}</li>
									</ul>
								</el-collapse-item>
								<el-collapse-item :title="$t('onLine.img')" name="4">
									<ul class="dialog-messge-ul">
										<li v-for="(item,index) in dialogMessgeImgData[fileDataNo]" @click="dialogMessgeOpenFile('path4',item.path)"
										 :key="index">{{item.name}}</li>
									</ul>
								</el-collapse-item>
							</el-collapse>
						</el-col>
						<el-col :span="16" style="background: #000;">
							<div v-if="dialogMessgeOpenFileClickType==='path1'">{{$t('onLine.nonsupport')}}</div>
							<div style="padding: 10px;" v-if="dialogMessgeOpenFileClickType==='path2'">
								<audio :src="dialogMessgeOpenFileSrc" controls></audio>
							</div>
							<video class="dialogMessgeImg-content" :src="dialogMessgeOpenFileSrc" v-if="dialogMessgeOpenFileClickType==='path3'"
							 controls></video>
							<img class="dialogMessgeImg-content" :src="dialogMessgeOpenFileSrc" v-if="dialogMessgeOpenFileClickType==='path4'">
						</el-col>
					</el-row>
				</el-dialog>
			</div>
			<div v-show="pageItem===1">
				<div id="container" :style="{height:mapsHeight}"></div>
				<div class="maps-tips-box" v-show="setState">
					<header>
						<p>{{tips.title}}</p>
					</header>
					<footer>
						<el-button @click="cancelSet">{{tips.cancel}}</el-button>
						<el-button type="primary" @click="confirmSet">{{tips.confirm}}</el-button>
					</footer>
				</div>
				<el-dialog width="50%" :title="$t('onLine.NewState')" :visible.sync="addRouteDialog">
					<div>
						<el-input :placeholder="$t('onLine.inputTips')" v-model="RouteDialogAddInput_id">
							<template slot="prepend">{{$t('onLine.routeNumber')}}：</template>
						</el-input>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button @click="AddRouteDialogCancelModify">{{$t('onLine.cancel')}}</el-button>
						<el-button type="primary" @click="AddRouteDialogConifrmModify">{{$t('onLine.confirm')}}</el-button>
					</div>
				</el-dialog>
				<el-dialog :title="$t('onLine.setRoute')" width="80%" :visible.sync="setRouteDialog1">
					<el-dialog width="60%" :title="$t('onLine.editingStatus')" :visible.sync="setRouteDialog2" append-to-body>
						<div>
							<el-input :placeholder="$t('onLine.inputTips')" type="textarea" :rows="2" v-model="setRouteDialog2ModifyInput_path">
								<template slot="prepend">{{$t('onLine.lntlatDegree')}}：</template>
							</el-input>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button @click="setRouteDialog2 = false">{{$t('onLine.cancel')}}</el-button>
							<el-button type="primary" @click="setRouteDialog2ConifrmModify">{{$t('onLine.confirm')}}</el-button>
						</div>
					</el-dialog>
					<el-table ref="multipleTable" :data="setRouteDialogData" height="450" tooltip-effect="dark" style="width: 100%"
					 @select="setRouteDialogSelection" @select-all="setRouteDialogSelectionAll">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column :label="$t('onLine.routeNumber')" width="150">
							<template slot-scope="scope">{{ scope.row.devicepId }}</template>
						</el-table-column>
						<el-table-column prop="devicepValue" :label="$t('onLine.lntlatDegree')">
						</el-table-column>
						<el-table-column width="200">
							<template slot="header" slot-scope="scope">
								<el-button @click="setRouteDialogRemoveRow('more')" type="text" size="small">{{$t('onLine.multipleRemove')}}</el-button>
							</template>
							<template slot-scope="scope">
								<el-button @click="setRouteDialogDefaultRow(scope.row)" type="text" size="small">{{$t('onLine.defalutRoute')}}</el-button>
								<el-button @click="setRouteDialogRemoveRow(scope.row)" type="text" size="small">{{$t('onLine.remove')}}</el-button>
								<el-button @click="setRouteDialogChangeRow(scope.row)" type="text" size="small">{{$t('onLine.edit')}}</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!-- <div slot="footer" class="dialog-footer">
						<el-button @click="outerVisible = false">取 消</el-button>
						<el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
					</div> -->
				</el-dialog>
			</div>
			<div v-show="pageItem===2">

			</div>
			<div v-show="pageItem===3">{{$t('onLine.onLineContrast')}}</div>
		</div>
		<!-- 聊天 -->
		<section ref="chartBox" class="chart" :style="{width:chartBoxWidth,top:chartPosition.top,left:chartPosition.left}">
			<div v-drag class="chart-drag" :style="{height:chartBoxWidth==='500px'?'31px':'30px',lineHeight:chartBoxWidth==='500px'?'31px':'30px'}">
				<i class="el-icon-rank"></i>
			</div>
			<el-collapse :accordion="true" @change="chartBoxChange">
				<el-collapse-item>
					<template slot="title">
						<el-row style="width:100%;margin-left: 40px;" type="flex">
							<el-col class="chart-icon-box" :span="4">
								<div @click.stop="allSend">
									<i class="iconfont well-4g-icon-duoren"></i>
								</div>
							</el-col>
							<el-col :span="16" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{fileDataNoText}}{{$t('onLine.onLineConversation')}}</el-col>
							<el-col class="chart-icon-box" :span="4">
								<i class="iconfont" :class="{'well-4g-icon-shousuojiantou':chartBoxWidth==='500px','well-4g-icon-shousuoshangjiantou':chartBoxWidth==='275px'}"></i>
							</el-col>
						</el-row>
					</template>
					<div>
						<el-container style="height: 100%;">
							<el-main style="overflow: hidden;height:400px;">
								<el-scrollbar ref="myChartScrollbar" :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle=""
								 :noresize="false" tag="section">
									<ul class="chart-box">
										<li v-for="(item,index) in chartData[fileDataNo]" :key="index">
											<div v-if="item.type==='machine'&&fileDataNoText!==$t('onLine.allMachine')" class="chart-machine">
												<el-tag>{{fileDataNo}}：</el-tag>
												<span class="chart-content-box" v-if="item.sign==='text'">{{item.value}}</span>
												<span class="chart-content-box" v-if="item.sign==='txt'"><a :href="item.value">{{item.value}}</a></span>
												<span v-if="item.sign==='audio'" class="chart-audio-machine-content chart-content-box">
													<i @click.stop="palyAudio($event)" class="iconfont well-4g-icon-yuyin1"></i>
													<audio :src="item.value" controls></audio>
												</span>
												<span class="chart-content-box" v-if="item.sign==='video'">
													<video @click="chartVideoEnlarge(item.value)" class="dialogMessgeImg-chart-video" :src="item.value"></video>
												</span>
												<span class="chart-content-box" v-if="item.sign==='img'">
													<viewer :images="[item.value]">
														<img v-if="item.value" :src="item.value" class="dialogMessgeImg-chart-media" />
													</viewer>
												</span>
											</div>
											<div v-if="item.type==='web'" class="chart-web">
												<span class="chart-content-box" v-if="item.sign==='text'">{{item.value}}</span>
												<span class="chart-content-box" v-if="item.sign==='txt'">{{item.value}}</span>
												<span v-if="item.sign==='audio'" class="chart-audio-content chart-content-box">
													<i @click.stop="palyAudio($event)" class="iconfont well-4g-icon-yuyin1"></i>
													<audio :src="item.value" controls></audio>
												</span>
												<span class="chart-content-box" v-if="item.sign==='video'">
													<video @click="chartVideoEnlarge(item.value)" class="dialogMessgeImg-chart-video" :src="item.value"></video>
												</span>
												<span class="chart-content-box" v-if="item.sign==='img'">
													<viewer :images="[item.value]">
														<img v-if="item.value" :src="item.value" class="dialogMessgeImg-chart-media" />
													</viewer>
												</span>
												<span class="chart-content-box" v-if="item.sign==='warning'">
													<i class="el-icon-bell" style="color:red;font-weight: 600;"></i>
												</span>
												<el-tag>：{{userName}}</el-tag>
											</div>
										</li>
									</ul>
								</el-scrollbar>
							</el-main>
							<el-footer class="dialogMessgeImg-box-footer" style="height: auto;">
								<el-row>
									<el-col :span="20">
										<el-input :placeholder="$t('onLine.inputTips')" v-model="sendChartInput" class="input-with-select">
											<el-button slot="append" icon="iconfont well-4g-icon-send" @click.stop="sendChart"></el-button>
											<el-button slot="append" :icon="recordingState?'audio-recording iconfont well-4g-icon-yuyin':'iconfont well-4g-icon-yuyin'"
											 @click.stop="startOrStopAudio"></el-button>
										</el-input>
									</el-col>
									<el-col :span="2">
										<el-form ref="newform">
											<!-- :auto-upload="false" :on-success="chartUploadSuccess"  :file-list="chartUploadFileList"  :data="chartUploadData"-->

											<el-upload :multiple="true" accept=".jpg,.mp4,.txt" :on-change="chartUploadChange" :on-remove="chartUploadRemove"
											 :auto-upload="false" ref="chartUploadRef" class="upload-demo" action="aa" :before-upload="chartUploadBefore">
												<el-button slot="trigger" size="small" :icon="'iconfont well-4g-icon-weibiaoti1 chart-upload-file'" type="primary"></el-button>
											</el-upload>
										</el-form>
									</el-col>
									<el-col :span="2">
										<el-button type="primary" @click.stop="sendWarning"><i class="el-icon-bell" style="font-size: 16px;"></i></el-button>
									</el-col>
								</el-row>
							</el-footer>
						</el-container>
					</div>
				</el-collapse-item>
			</el-collapse>
		</section>
		<!-- end -->
		<el-dialog v-dialogDrag ref="dialog__wrapper" :title="$t('common.video')" :visible.sync="videoVisible" v-if="videoVisible"
		 width="680px">
			<span>
				<video :src="videoUrl" width="640" controls autoplay>{{$t('home.notUseHtml5')}}</video>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	let map, Marker, AMap, google, SPOT;
	import Vue from 'vue'
	if (MAP_TYPE == 1) {
		AMap = require('AMap')
	} else if (MAP_TYPE == 2) {
		google = require('google')
		SPOT = require('../../assets/img/spot.png')
	}
	import maps_1 from '../../assets/img/beachflag2.png'
	import maps_2 from '../../assets/img/beachflag.png'
	import Recorder from 'recorderx';
	import {
		encodeWAV
	} from 'recorderx';
	import xhTree from '../common/xh_tree'

	export default {
		components: {
			xhTree: xhTree
		},
		data() {
			return {
				//视频弹窗
				videoVisible: false,
				videoUrl: '',
				//设置路线时修改的输入框绑定值
				// setRouteDialog2ModifyInput_name: "",
				setRouteDialog2ModifyInput_path: "",
				// setRouteDialog2ModifyInput_meno: "",
				setRouteDialog2ModifyInput_id: "",
				RouteDialogAddInput_name: "",
				RouteDialogAddInput_id: "",
				RouteDialogAddInput_meno: "",
				RouteDialogAddInput_path: "",
				//当前路线弹窗后保存的设备id
				currentMapsRouteDataNo: "",
				//设置路线的表格数据
				setRouteDialogData: [],
				//设置路线时多选保存的路线数据
				setRouteDialogDataMultipleSelection: [],
				//设置路线的弹窗
				setRouteDialog1: false,
				setRouteDialog2: false,
				addRouteDialog: false,
				//tree滚动条的位置
				treeScrollPosition: "",
				//树的搜索
				treeSearchState: '',
				//聊天上传文件的参数
				chartUploadData: {
					client_id: sessionStorage.getItem('comName'),
					client_type: "web",
					login_id: "",
					send_to: "",
				},
				//聊天上传url
				// chartUploadUrl:"a",
				//聊天弹from
				chartUploadForm: new FormData(),
				//聊天的点击后的文字
				fileDataNoText: "",
				//聊天框的默认宽度
				chartBoxWidth: "275px",
				//用户名
				userName: sessionStorage.getItem('user_name'),
				//音频
				rc: Object,
				//录音状态
				recordingState: false,
				//蓝牙消息弹窗
				dialogLanYaMessge: false,
				//蓝牙消息弹窗的数据
				dialogLanYaMessgeTableData: {},
				//当前打开蓝牙弹窗的设备编号
				LanYaDataNo: "",
				//聊天框的输入框值
				sendChartInput: "",
				//聊天数据
				chartData: {
					"all": []
				},
				//聊天框的位置
				chartPosition: {
					top: "",
					left: "",
					currentX: "",
					currentY: ""
				},
				//聊天发送文件的数据列表控制
				chartUploadFileList: [],
				//聊天的文件个数
				chartUploadFileNumber: 0,

				toggleArrow: true,
				pageItem: 0,
				//推送的服务地址
				serverUrl: SIGNALR_URL,
				serverData: [],
				//当前播放器的机器号
				DataNo: ["", "", "", ""],
				playState: [true, true, true, true],
				//消息弹窗的显示和隐藏
				dialogMessge: false,
				//消息弹窗的手风琴列表项
				activeDialogMessgeName: "0",
				//消息弹窗中点击的列表中的类型
				dialogMessgeOpenFileClickType: "",
				//消息弹窗中点击的图片src
				dialogMessgeOpenFileSrc: "",
				//消息弹窗中所有图片、视频、音频、文件的数据
				dialogMessgeImgData: {},
				dialogMessgeVideoData: {},
				dialogMessgeFileData: {},
				dialogMessgeAudioData: {},
				//文设备传件时打开弹窗的设备编号
				fileDataNo: "",
				//播放器的高度
				videoHeight: "",
				//地图的高度
				mapsHeight: "",
				//点击地图的标记数量
				signNumber: 0,
				signLngLat: [],
				//进入和退出设置的状态
				setState: false,
				//后台推流过来的数据
				treeData: [],
				//地图右下方的弹窗口的文字
				tips: {
					title: "",
					confirm: this.$t('onLine.confirm'),
					cancel: this.$t('onLine.cancel')
				},
				//记录当前处于定位的机器信息
				currentLocaltionMachine: {
					dataNo: "",
					lng: "",
					lat: "",
					ConnectedID: ""
				},
				//记录当前处于设置路线的机器编号
				currentDeviceId: "",
				//设置路线时，保存选中的路线
				mapsRoute: [],
				mapZoom: 0,
				//设备数据
				DeviceData: [],
				webApiUrl: NEW_URL_CONFIG,
				directionsDisplay: Object,
				directionsService: Object,
				productData: Array
			};
		},
		props: ["language"],
		watch: {
			language(n, o) {
				if (n != o) {
					//console.log("执行了")
					if (MAP_TYPE == 1) {
						const language = localStorage.getItem("languageType");
						let lang = language === 'zh-CN' ? 'zh_cn' : language === 'en-US' ? 'en' : 'zh_en'
						map.setLang(lang)
					} else if (MAP_TYPE == 2) {
						window.location.reload()
					}
					this.tips.title = this.$t('onLine.setLocaltion')
					this.tips.confirm = this.$t('onLine.confirm')
					this.tips.cancel = this.$t('onLine.cancel')
				}
			},
			'$route': function(newVal, oldVal) {
				switch (newVal.params.id) {
					case 'video':
						this.pageItem = 0;
						break;
					case 'patrol':
						this.pageItem = 1;
						if (MAP_TYPE == 1) {
							this.drawMapMachineSign()
						} else if (MAP_TYPE == 2) {
							this.googleDrawMapMachineSign()
						}
						break;
					case 'face':
						this.pageItem = 2;
						break;
					case 'contrast':
						this.pageItem = 3;
						break;
				}
			}
		},
		created() {
			let that = this;
			const TOKEN = sessionStorage.getItem('loginPrefix') + " " + sessionStorage.getItem('loginToken');
			that.$axios.interceptors.request.use(
				config => {
					config.headers.Authorization = TOKEN;
					return config;
				},
				error => {
					return Promise.reject(error);
				}
			);
			that.$axios.post(that.webApiUrl + "/api/production/select", {
				"pageIndex": 1,
				"pageSize": 99999
			}).then(res => {
				if (res.data.statusCode === 200) {
					//console.log(res.data.data.resultObjects)
					var o = JSON.parse(JSON.stringify(res.data.data.resultObjects[0]))
					that.productData = res.data.data.resultObjects

				} else {
					if (res.data.statusCode === 407 || res.data.statusCode === 402) {
						that.goLogin();
					} else {
						that.$message.error(that.$t("onLine.serviceError"));
					}
				}
			})
			const SRC = $("#mapsApi").attr("src");
			if (MAP_TYPE == 2 && this.pageItem == 1 && localStorage.getItem("languageType") !== SRC.substring(SRC.indexOf(
					"language=") + 9, SRC.length)) {
				window.location.reload();
			}
			this.closeService();
			//初始路由赋值
			switch (this.$route.params.id) {
				case 'video':
					this.pageItem = 0;
					break;
				case 'patrol':
					if (MAP_TYPE == 1) {
						this.drawMapMachineSign()
					} else if (MAP_TYPE == 2) {
						this.googleDrawMapMachineSign()
					}
					this.pageItem = 1;
					break;
				case 'face':
					this.pageItem = 2;
					break;
				case 'contrast':
					this.pageItem = 3;
					break;
			}
		},
		directives: {
			drag(el, bindings, vnode) {
				el.onmousedown = function(e) {
					let box = vnode.context.$refs.chartBox;
					vnode.context.chartPosition.currentX = e.pageX - box.offsetLeft;
					vnode.context.chartPosition.currentY = e.pageY - box.offsetTop;
					document.onmousemove = function(e) {
						vnode.context.chartPosition.left = e.pageX - vnode.context.chartPosition.currentX + 'px';
						vnode.context.chartPosition.top = e.pageY - vnode.context.chartPosition.currentY + 'px';
					}
					document.onmouseup = function() {
						document.onmousemove = document.onmouseup = null;
					}
					box = null;
				}
				el = null;
			}
		},
		methods: {
			/*------------------------------------谷歌地图开始-----------------------------------------*/
			googleDrawMapMachineSign() {
				let elem = document.getElementById('container')
				// elem.innerHTML = ""
				//console.log("绘制开始")
				let that = this
				//获取经纬度网站必须为安全网址，https协议
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(position => {
						//经度，纬度
						var longitude = position.coords.longitude.toFixed(6) * 1,
							latitude = position.coords.latitude.toFixed(6) * 1;
						const ARY = coordtransform.wgs84togcj02(longitude,latitude)
						//console.log(longitude, latitude)
						////console.log(coordtransform.wgs84togcj02(that.currentLocaltionMachine.lng, that.currentLocaltionMachine.lat))
						that.directionsDisplay = new google.maps.DirectionsRenderer;
						that.directionsService = new google.maps.DirectionsService;
						map = new google.maps.Map(elem, {
							zoom: 12,
							center: {
								lng: ARY[0],
								lat: ARY[1]
							}
						});
						that.directionsDisplay.setMap(map);
						that.google_drawMapMachineSign();
					}, error => {
						/*
						没有证书时，临时待用
						22.71049948869435
						114.04842186664865
						*/
						that.directionsDisplay = new google.maps.DirectionsRenderer;
						that.directionsService = new google.maps.DirectionsService;
						map = new google.maps.Map(elem, {
							zoom: 12
						});
						that.directionsDisplay.setMap(map);
						that.google_drawMapMachineSign();
					})
				}
			},
			google_drawMapMachineSign() {
				let that = this;
				const LEN = that.DeviceData.length;
				// //console.log(JSON.parse(JSON.stringify(that.DeviceData)))
				for (let i = 0; i < LEN; ++i) {
					//如果当前机器的经纬度为空的话就不执行绘制标记
					const LON = that.DeviceData[i].Longitude,
						LAT = that.DeviceData[i].Latitude
					if (LON === "" || LAT === "") continue;
					const img = that.DeviceData[i].ConnectedID != "" ? maps_2 : maps_1;
					const DATANO = that.DeviceData[i].DataNo;
					if (that["marker" + DATANO]) that["marker" + DATANO].setMap(null);
					const ARY = coordtransform.wgs84togcj02(LON,LAT)
					that["marker" + DATANO] = new google.maps.Marker({
						position: {
							lng: ARY[0],
							lat: ARY[1]
						},
						map: map,
						icon: img,
						title: DATANO
					});
					//闭包实现循环内绑定事件
					(function(DataNo) {
						google.maps.event.addListener(that["marker" + DataNo], 'click', () => {
							that.checkRoute(DataNo)
						})
					})(DATANO)
				}
			},
			checkRoute(DataNo) {
				let that = this;
				that.$axios.post(that.webApiUrl + "/api/devicepath/select", {
					"devicepUse": true,
					"deviceId": DataNo
				}).then(res => {
					if (res.data.statusCode === 200) {
						const ARY = res.data.data.resultObjects[0].devicepValue.split(":");
						const LEN = ARY.length;
						let ary = []
						for (let i = 0; i < LEN; ++i) {
							let tempAry = ARY[i].split(",");
							ary.push({
								n: tempAry[0],
								a: tempAry[1]
							});
						}
						that.mapZoom = map.getZoom()
						that.google_drawRoute(ary);
					} else {
						if (res.data.statusCode === 407 || res.data.statusCode === 402) {
							that.goLogin();
						} else {
							that.$message.error(that.$t("onLine.serviceError"));
						}
					}
				})
			},
			google_drawRoute(ary) {
				//console.log(ary)
				let that = this
				//绘制路线
				let ary_end = ary[ary.length - 1];
				const ary_start_A = ary[0].a,
					ary_start_N = ary[0].n;
				var start = new google.maps.LatLng(ary_start_A, ary_start_N),
					end = new google.maps.LatLng(ary_end.a, ary_end.n);
				let ary_start_marker = ary[0].marker
				if (ary_start_marker) {
					ary_start_marker.setMap(null);
					ary_start_marker = null;
					ary_end.marker.setMap(null);
					ary_end.marker = null;
				}

				var waypts = [],
					wayptsStr = ary_start_N + "," + ary_start_A + ":";
				const LEN = ary.length - 1;
				for (var i = 1; i < LEN; ++i) {
					const A = ary[i].a,
						N = ary[i].n
					var nb = new google.maps.LatLng(A, N);
					wayptsStr += N + "," + A + ":";
					waypts.push({
						location: nb,
						stopover: true
					});
					let marker = ary[i].marker
					if (marker) {
						marker.setMap(null);
						marker = null;
					}
				}
				wayptsStr += ary_end.n + "," + ary_end.a;
				//console.log(wayptsStr);
				var request = {
					origin: start,
					destination: end,
					waypoints: waypts,
					optimizeWaypoints: true,
					travelMode: google.maps.TravelMode.DRIVING
				};
				that.directionsService.route(request, function(response, status) {
					////console.log(status)
					if (status == 'OK') {
						that.directionsDisplay.setDirections(response);
					}
				});
			},

			/*-------------------------------------谷歌地图结束----------------------------------------*/
			goLogin() {
				let that = this
				that.$message({
					showClose: true,
					message: that.$t("common.logoutTitle"),
					type: 'error',
					onClose() {
						that.$router.push("/login");
					}
				})
			},
			querySearchAsync(queryString, cb) {
				//搜索
				var restaurants = this.DeviceData;
				var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
				cb(results);
			},
			createStateFilter(queryString) {
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
				};
			},
			handleSelect(item) {
				//点击后定位到位置
				let span = $(".search-label");
				const SPAN_LEN = span.length;
				for (let i = 0; i < SPAN_LEN; ++i) {
					if (span.eq(i).attr("data-label") === item.value) {
						let find_span = span.eq(i);
						find_span.addClass("search-label-find");
						this.$refs['myTreeChartScrollbar'].wrap.scrollTop = find_span.parent().position().top
						setTimeout(() => {
							find_span.removeClass("search-label-find");
						}, 4000)
						return;
					}
				}
			},
			/*------------------------------------高德地图开始-----------------------------------------*/

			drawRoute(route) {
				const path = route
				const LEN = path.length - 1;
				let waypointsAry = [];
				let i = 1;
				let that = this;
				for (;;) {
					if (i === LEN) break;
					waypointsAry.push(new AMap.LngLat(path[i][0], path[i][1]))
						++i;
				}
				//构造路线导航类
				let driving = new AMap.Driving({
					map: map
				});
				//map.remove([driving]);
				map.clearMap()
				this.drawMapMachineSign();
				//console.log(path)
				// 根据起终点经纬度规划驾车导航路线
				driving.search(new AMap.LngLat(path[0][0], path[0][1]), new AMap.LngLat(path[LEN][0], path[LEN][1]), {
						waypoints: waypointsAry
					},
					function(status, result) {
						// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
						map.setZoom(that.mapZoom)
					});
			},
			getPatrolRoute(e) {
				//判断是点击设备标记过来的还是点击查看机器过来的
				const DataNo = e.target ? e.target.DataNo : e;
				let that = this;
				// //console.log(DataNo)
				//加载巡逻路线
				that.$axios.post(that.webApiUrl + "/api/devicepath/select", {
					"devicepUse": true,
					"deviceId": DataNo
				}).then(res => {
					//console.log(res)
					if (res.data.statusCode === 200) {
						if (res.data.data.resultObjects.length == 0) {
							that.$message.error(that.$t("onLine.currentDeviceNotRoute"));
							return false;
						}
						const ARY = res.data.data.resultObjects[0].devicepValue.split(":");
						const LEN = ARY.length;
						let ary = []
						for (let i = 0; i < LEN; ++i) {
							let tempAry = ARY[i].split(",");
							ary.push(tempAry);
						}
						that.mapZoom = map.getZoom()
						that.drawRoute(ary);
					} else {
						if (res.data.statusCode === 407 || res.data.statusCode === 402) {
							that.goLogin();
						} else {
							that.$message.error(that.$t("onLine.serviceError"));
						}
					}
				})
			},
			drawMapMachineSign() {
				let that = this;
				////console.log(JSON.parse(JSON.stringify(that.DeviceData)))
				////console.log("进来")
				const len = that.DeviceData.length
				for (let i = 0; i < len; ++i) {
					//如果当前机器的经纬度为空的话就不执行绘制标记
					const LON = that.DeviceData[i].Longitude,
						LAT = that.DeviceData[i].Latitude
					if (LON === "" || LAT === "") continue;
					const img = that.DeviceData[i].ConnectedID != "" ? maps_2 : maps_1;
					//清空之前的机器标记
					const DATANO = that.DeviceData[i].DataNo
					const KEY = "marker" + DATANO
					if (that[KEY]) that[KEY].setMap(null);
					//处理经纬度精确问题
					//生成地图机器标记
					that["lng" + DATANO] = ARY[0]
					that["lat" + DATANO] = ARY[1]
					that[KEY] = new AMap.Marker({
						icon: img,
						position: ARY,
						title: DATANO
					});

					that[KEY].setMap(map);
					//通知后台机器新的定位
					//闭包实现循环内绑定事件
					(function(DataNo) {
						that["marker" + DataNo].on('click', that.getPatrolRoute);
						that["marker" + DataNo].DataNo = DataNo
					})(DATANO)
				}
			},
			clickJiQi(node) {
				if (!node.ConnectedID) {
					this.$message.error(node.DataNo + this.$t('onLine.notOnLine'));
					return false;
				} else {
					this.fileDataNoText = this.fileDataNo = node.DataNo
				}
				if (node.Longitude && node.Longitude != "") {
					map.setCenter([lng, lat]); //设置地图中心点
				} else {
					this.$message.error(node.DataNo + this.$t('onLine.notSetPatrolRoute'));
				}
			},
			location(node) {
				this.tips.title = this.$t('onLine.setLocaltion')
				this.tips.type = "localtion"
				this.setState = true
				this.currentLocaltionMachine.dataNo = node.DataNo
				this.currentLocaltionMachine.ConnectedID = node.ConnectedID
				if (MAP_TYPE == 1) {
					//开始设置设备定位时，bind map click event,localtion end relieve click event
					map.on('click', this.machineLocation);
					map.off('click', this.mapsAddSign);
				} else if (MAP_TYPE == 2) {
					//google maps location
					google.maps.event.clearListeners(map, 'click');
					let that = this
					map.addListener('click', e => {
						e = e || window.event
						that.currentLocaltionMachine.lng = e.latLng.lng()
						that.currentLocaltionMachine.lat = e.latLng.lat()
						const lnglatData = {
							lng: e.latLng.lng(),
							lat: e.latLng.lat()
						};
						const DATANO = that.currentLocaltionMachine.dataNo
						if (that["marker" + DATANO]) {
							that["marker" + DATANO].setMap(null);
							that["marker" + DATANO] = null;
						}
						const img = that.currentLocaltionMachine.ConnectedID ? maps_2 : maps_1
						that['marker' + DATANO] = new google.maps.Marker({
							position: lnglatData,
							icon: img,
							map: map,
							draggable: true
						});
					});
				}

			},
			machineLocation(e) {
				//机器定位，map 上添加标记，每一次点击map清空上一次点击的相同机器编号的标记
				const MARKER_DATANO = "marker" + this.currentLocaltionMachine.dataNo
				if (this[MARKER_DATANO]) this[MARKER_DATANO].setMap(
					null);
				const img = this.currentLocaltionMachine.ConnectedID ? maps_2 : maps_1,
					lng = e.lnglat.getLng(),
					lat = e.lnglat.getLat();
				this.currentLocaltionMachine.lng = lng
				this.currentLocaltionMachine.lat = lat
				//生成地图机器标记
				this[MARKER_DATANO] = new AMap.Marker({
					icon: img,
					position: [lng, lat]
				});
				this[MARKER_DATANO].setMap(map);
			},
			mapsCheckRoter(node) {
				//查看当前设备的路线
				const ID = node.DataNo
				if (!this["marker" + ID]) {
					//机器设备标记没有存在
					this.$message.error(ID + this.$t("onLine.notMachineMaps"));
					return false;
				}

				if (MAP_TYPE == 1) {
					this.clearEvent()
					this["marker" + ID].DataNo = ID
					this.getPatrolRoute(ID)
				} else if (MAP_TYPE == 2) {
					//谷歌
					this.checkRoute(ID)
				}

			},
			setRouteDialogDefaultRow(row) {
				let that = this;
				that.$axios.put(that.webApiUrl + "/api/devicepath/edit/default", {
					devicepId: row.devicepId,
					deviceId: row.deviceId
				}, {
					headers: {
						"Content-Type": "application/json;charset=utf-8"
					}
				}).then((res) => {
					if (res.data.statusCode === 200) {
						that.$message.success(that.$t("onLine.modify") + row.devicepId + that.$t("onLine.defalutRoute"));
					} else {
						if (res.data.statusCode === 407 || res.data.statusCode === 402) {
							that.goLogin();
						} else {
							that.$message.error(that.$t("onLine.serviceError"));
						}
					}
				})
			},
			setRouteDialogRemoveRow(row) {
				//console.log(row)
				let that = this;
				let ary = []
				let param = {
					devicepIds: [],
				}
				const ID = that.currentMapsRouteDataNo || row.deviceId;
				if (row !== 'more') {
					param.devicepIds.push({
						"deviceId": row.deviceId,
						"devicepId": row.devicepId
					})
				} else {
					let LEN = that.setRouteDialogDataMultipleSelection.length;
					for (let i = 0; i < LEN; ++i) {
						param.devicepIds.push({
							"deviceId": ID,
							"devicepId": that.setRouteDialogDataMultipleSelection[i].devicepId
						})
					}
				}
				if (param.devicepIds.length == 0) {
					return false;
				}
				that.$axios.delete(that.webApiUrl + "/api/devicepath/delete", {
					data: param
				}).then((res) => {
					//console.log(res)
					if (res.data.statusCode === 200) {
						that.$message.success(that.$t("onLine.removeSuccess"));
						that.getRouteData()
					} else {
						if (res.data.statusCode === 407 || res.data.statusCode === 402) {
							that.goLogin();
						} else {
							that.$message.error(that.$t("onLine.serviceError"));
						}
					}
				})
			},
			setRouteDialogChangeRow(row) {
				this.setRouteDialog2 = true;
				this.setRouteDialog2ModifyInput_path = row.devicepValue
				this.setRouteDialog2ModifyInput_id = row.devicepId
				this.currentMapsRouteDataNo = row.deviceId
			},
			setRouteDialog2ConifrmModify() {
				// //console.log("确认修改,数据提交到后台")
				let that = this;
				if (!that.setRouteDialog2ModifyInput_path) {
					that.$message.error(that.$t("onLine.lntlatNotEmpty"));
					return false;
				}
				const OBJ = {
					devicepValue: that.setRouteDialog2ModifyInput_path,
					devicepId: that.setRouteDialog2ModifyInput_id,
					deviceId: that.currentMapsRouteDataNo
				}
				//console.log(OBJ)
				that.$axios.put(that.webApiUrl + "/api/devicepath/edit/path", OBJ).then((res) => {
					//console.log(res)
					if (res.data.statusCode === 200) {
						that.$message.success(that.$t("common.editSuccessTitle"));
						that.setRouteDialog2 = false;
						that.getRouteData()
						that.setRouteDialog2ModifyInput_path = ""
					} else {
						if (res.data.statusCode === 407 || res.data.statusCode === 402) {
							that.goLogin();
						} else {
							that.$message.error(that.$t("onLine.serviceError"));
						}
					}
				})
			},
			AddRouteDialogCancelModify() {
				this.addRouteDialog = false
				if (MAP_TYPE == 1) {
					map.clearMap()
					this.drawMapMachineSign()
					map.off('click', this.mapsAddSign);
				} else if (MAP_TYPE == 2) {
					this.directionsDisplay.setMap(null)
					this.googleDrawMapMachineSign()
					google.maps.event.clearListeners(map, 'click');
				}
			},
			AddRouteDialogConifrmModify() {
				//新增确定
				//console.log("新增确定")
				let that = this
				const ARY = [{
					"devicepValue": that.RouteDialogAddInput_path,
					"devicepStandard": new Date().getTime(),
					"devicepUse": true,
					"deviceId": that.currentDeviceId,
					"devicepId": that.RouteDialogAddInput_id
				}]
				if (!that.RouteDialogAddInput_id) {
					that.$message.error(that.$t("onLine.routeNumberNotEmpty"));
					return false;
				}
					// "devicepId": that.RouteDialogAddInput_id,
					// "deviceId": that.currentDeviceId
						that.$axios.post(that.webApiUrl + "/api/devicepath/add", ARY, ).then((res) => {
							console.log(res)
							if (res.data.data === 1 && res.data.statusCode === 200) {
								that.$message.success(that.$t("onLine.add") + that.RouteDialogAddInput_name + that.$t("onLine.routeSuccess"));
								that.addRouteDialog = false
								that.RouteDialogAddInput_id = ""
								that.currentDeviceId = ""
								that.RouteDialogAddInput_path = ""
								if (MAP_TYPE == 1) {
									map.clearMap()
									that.drawMapMachineSign()
									map.off('click', that.mapsAddSign);
								} else if (MAP_TYPE == 2) {
									that.directionsDisplay.setMap(null)
									that.googleDrawMapMachineSign()
									google.maps.event.clearListeners(map, 'click');
								}
							} else {
								if (res.data.statusCode === 407 || res.data.statusCode === 402) {
									that.goLogin();
								} else {
									that.$message.error(that.$t("onLine.serviceError"));
								}
							}
						})
						that.$message.error(that.$t("onLine.routeNumberAlreadyExist"));
				// 	}
				// })


			},
			setRouteDialogSelection(val) {
				this.setRouteDialogDataMultipleSelection = val
			},
			setRouteDialogSelectionAll(val) {
				this.setRouteDialogDataMultipleSelection = val
			},
			getRouteData(fn) {
				let that = this;
				that.$axios.post(that.webApiUrl + "/api/devicepath/select", {
					"pageIndex": 1,
					"pageSize": 99999,
					"deviceId": that.currentMapsRouteDataNo
				}).then((res) => {
					//console.log(res)
					if (res.data.statusCode === 200) {
						that.setRouteDialogData = res.data.data.resultObjects;
						if (fn) {
							fn();
						}
						//that.currentMapsRouteDataNo = ""
					} else {
						if (res.data.statusCode === 407 || res.data.statusCode === 402) {
							that.goLogin();
						} else {
							that.$message.error(that.$t("onLine.serviceError"));
							//that.$message.error(res.data.message);
						}
					}
				})
			},
			mapsSetRoutePop(node) {
				//弹窗设置设备路线
				//加载所有路线，可修改，删除等
				let that = this
				that.currentMapsRouteDataNo = node.DataNo;
				that.getRouteData(() => {
					that.setRouteDialog1 = true;
				});
			},
			mapsBindClick(node) {
				//事件绑定点击，为当前设备添加点击，告诉mapsAddSign函数是为哪个设备添加的点击事件
				//判断机器是否在线，不在线不给设置
				this.signNumber = 0
				this.setState = true
				this.tips.title = this.$t('onLine.setRoute')
				// this.tips.confirm = this.$t('onLine.confirm')
				// this.tips.cancel = this.$t('onLine.cancel')
				this.tips.type = "route"
				this.currentDeviceId = node.DataNo
				this.mapZoom = map.getZoom()
				if (MAP_TYPE == 1) {
					map.on('click', this.mapsAddSign);
					map.off('click', this.machineLocation);
					map.clearMap()
					this.drawMapMachineSign()
				} else if (MAP_TYPE == 2) {
					google.maps.event.clearListeners(map, 'click');
					let that = this
					map.addListener('click', e => {
						e = e || window.event
						that.signLngLat[that.signNumber] = [e.latLng.lng(), e.latLng.lat()]
						if (that.signNumber > 0) {
							const LEN = that.signLngLat.length,
								start = new google.maps.LatLng(that.signLngLat[0][1], that.signLngLat[0][0]),
								end = new google.maps.LatLng(that.signLngLat[LEN - 1][1], that.signLngLat[LEN - 1][0]);
							// //console.log(that.signLngLat)
							var waypts = [];
							for (var i = 1; i < LEN - 1; ++i) {
								var nb = new google.maps.LatLng(that.signLngLat[i][1], that.signLngLat[i][0]);
								waypts.push({
									location: nb,
									stopover: true
								});
							}

							var request = {
								origin: start,
								destination: end,
								waypoints: waypts,
								optimizeWaypoints: true,
								travelMode: google.maps.TravelMode.DRIVING
							};
							that.directionsService.route(request, function(response, status) {
								//console.log(status)
								if (status == 'OK') {
									that.directionsDisplay.setDirections(response);
								}
							});
							that['marker_route' + (--that.signNumber)].setMap(null);
						} else {
							that['marker_route' + that.signNumber] = new google.maps.Marker({
								position: {
									lng: e.latLng.lng(),
									lat: e.latLng.lat()
								},
								icon: SPOT,
								map: map,
								// draggable: true
							});
						}
						that.signNumber++;


					});
				}

			},
			mapsAddSign(e) {
				//设置当前用户点击
				let that = this
				//添加一条新的路线
				//保存地图上标记的经纬度
				this.signLngLat[this.signNumber] = [e.lnglat.getLng(), e.lnglat.getLat()]
				// //console.log(JSON.parse(JSON.stringify(this.signLngLat)))
				if (this.signNumber > 0) {
					//构造路线导航类
					var driving = new AMap.Driving({
						map: map
					});
					// 根据起终点经纬度规划驾车导航路线
					driving.search(new AMap.LngLat(this.signLngLat[this.signNumber - 1][0], this.signLngLat[this.signNumber - 1][1]),
						new AMap.LngLat(this.signLngLat[this.signNumber][0], this.signLngLat[this.signNumber][1]),
						function(status, result) {
							// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
							map.setZoom(that.mapZoom)
						}
					);
					//清空之前生成的标记

					map.remove(Marker);
				} else {
					const imageOffset = this.signNumber === 0 ? new AMap.Pixel(-9, -3) : new AMap.Pixel(-52, -3)
					var startIcon = new AMap.Icon({
						// 图标尺寸
						size: new AMap.Size(25, 34),
						// 图标的取图地址
						image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
						// 图标所用图片大小
						imageSize: new AMap.Size(135, 40),
						// 图标取图偏移量
						imageOffset: imageOffset
					});
					// 将 icon 传入 marker
					Marker = new AMap.Marker({
						position: new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat()),
						icon: startIcon,
						offset: new AMap.Pixel(-13, -30)
					});
					//地图上的标记增加
					Marker.setMap(map);
				}
				// //console.log(JSON.parse(JSON.stringify(that.signLngLat)))
				this.signNumber++
			},
			confirmSet() {
				//确定设置
				let that = this;

				if (this.tips.type === "route") {
					//确定设置路线，则把当前设置的路线设置到原数据中，提交到后台接口
					if (that.signLngLat.length == 0) {
						that.$message.error(that.$t("onLine.setRouteTips"));
						return false;
					}
					that.setState = false
					var wayptsStr = that.signLngLat[0][0] + "," + that.signLngLat[0][1] + ":";
					let len = that.signLngLat.length - 1;
					for (var i = 1; i < len; ++i) {
						wayptsStr += that.signLngLat[i][0] + "," + that.signLngLat[i][1] + ":"
					}
					wayptsStr += that.signLngLat[len][0] + "," + that.signLngLat[len][1];
					that.RouteDialogAddInput_path = wayptsStr
					//console.log(wayptsStr);

					that.signLngLat = []
					that.addRouteDialog = true
					that.signNumber = 0
				} else if (this.tips.type === "localtion") {
					if (!that.currentLocaltionMachine.lng || !that.currentLocaltionMachine.lat) {
						that.$message.error(that.$t("onLine.setLocaltions"));
						return false;
					}
					//设置定位,通知后台定位的数据
					if (MAP_TYPE == 1) {
						map.off('click', that.machineLocation);
					} else if (MAP_TYPE == 2) {
						google.maps.event.clearListeners(map, 'click');
					}
					//通知服务更改定位数据

					that.$axios.put(that.webApiUrl + "/api/device/edit/location", {
						"deviceLongitude": that.currentLocaltionMachine.lng,
						"deviceLatitude": that.currentLocaltionMachine.lat,
						"deviceId": that.currentLocaltionMachine.dataNo
					}).then((res) => {
						//console.log(res)
						if (res.data.statusCode === 200) {
							that.$message.success(that.$t("onLine.modify") + that.currentLocaltionMachine.dataNo + that.$t(
								"onLine.localtionSuccess"));
							that.currentLocaltionMachine.dataNo = ""
							that.currentLocaltionMachine.lng = ""
							that.currentLocaltionMachine.lat = ""
							that.currentLocaltionMachine.ConnectedID = ""
						} else {
							if (res.data.statusCode === 407 || res.data.statusCode === 402) {
								that.goLogin();
							} else {
								that.$message.error(that.$t("onLine.serviceError"));
							}
						}
						that.setState = false
					})
				}
			},
			cancelSet() {
				this.setState = false
				if (this.tips.type === "route") {
					if (MAP_TYPE == 1) {
						map.off('click', this.mapsAddSign);
						map.clearMap()
						this.drawMapMachineSign()
					} else if (MAP_TYPE == 2) {
						this.directionsDisplay.setMap(null)
						this.google_drawMapMachineSign()
						google.maps.event.clearListeners(map, 'click');
					}
					this.currentDeviceId = ""
					this.signLngLat = []
					this.RouteDialogAddInput_path = ""
					this.addRouteDialog = false

					this.signNumber = 0
				} else if (this.tips.type === "localtion") {

					if (MAP_TYPE == 1) {
						map.off('click', this.machineLocation);
						map.clearMap()
						this.drawMapMachineSign()
					} else if (MAP_TYPE == 2) {
						this.google_drawMapMachineSign()
						google.maps.event.clearListeners(map, 'click');
					}
					//清空当前处于定位的机器
					this.currentLocaltionMachine.dataNo = ""
					this.currentLocaltionMachine.lng = ""
					this.currentLocaltionMachine.lat = ""
				}
			},
			clearEvent() {
				map.off('click', this.mapsAddSign);
				map.off('click', this.machineLocation);
			},
			/*------------------------------------高德地图开始-----------------------------------------*/
			chartBoxChange(val) {
				this.chartBoxWidth = val ? "500px" : "275px";
				this.judgeChartMachineOnline();
			},
			startOrStopAudio() {
				let that = this
				if (!that.judgeChartMachineOnline()) {
					return false;
				}
				if (!that.recordingState) {
					if (navigator.getUserMedia) {
						let b = true;
						navigator.getUserMedia({
							audio: true
						}, function() {
							//console.log(2)
							that.rc.start()
							that.recordingState = true
						}, function() {
							//console.log(1)
							b = false;
							that.$message.error(that.$t("onLine.startOrStopAudioError"));
						});
						if (!b) return;
					} else {
						that.$message.error(that.$t("onLine.startOrStopAudioError"));
						return false;
					}
				} else {
					//发送语音
					that.recordingState = false
					that.rc.pause()
					var reader = new FileReader();
					reader.onload = function(e) {
						var arr = reader.result.split(','),
							mime = arr[0].match(/:(.*?);/)[1],
							bstr = atob(arr[1]),
							n = bstr.length,
							u8arr = new Uint8Array(n);
						while (n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						let file = new File([u8arr], new Date().getTime() + ".mp3", {
							type: mime
						})
						let machine_str = that.judgeChartMachineOnline()
						if (!machine_str) {
							return false;
						}
						let id = that.fileDataNo
						if (typeof machine_str === "string") {
							that.$message.error(this.$t("onLine.sendChartNotAllFile"));
							return false;
						}
						var formData = new FormData($("#uploadForm")[0]);
						formData.append('client_id', sessionStorage.getItem('comName'));
						formData.append('client_type', "web");
						formData.append('file_key', "123");
						formData.append('login_id', that.userName);
						formData.append('send_to', id);
						formData.append('file', file, file.name);
						formData.append('user_id', "");
						//console.log(file)
						//这里去请求后台，或是通知后台
						const CONFIG = {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						};
						that.$axios.post(that.serverUrl + '/DVR/WebServer/PostFile', formData, CONFIG)
							.then(response => {
								//console.log(response)
								that.chartData[that.fileDataNo].push({
									type: "web",
									sign: "audio",
									value: that.rc.getRecordWav()
								})
								that.sendChartInput = "1"
								that.$nextTick(() => {
									that.scrollDown()
									that.sendChartInput = ""
								})
							})
					}
					var pcm = this.rc.getRecord();
					const blob = encodeWAV(pcm, 16, 44100)
					reader.readAsDataURL(blob);
				}
			},
			palyAudio(e) {
				let audio = $(e.target).parent().find("audio")[0]
				if (audio.paused) {
					audio.play(); //audio.play();// 这个就是播放
				} else {
					audio.pause(); // 这个就是暂停
				}
			},
			chartVideoEnlarge(path) {
        this.videoVisible = true;
				this.videoUrl = path;
			},
			loadLanYaMesg(node) {
				//蓝牙消息弹窗
				this.dialogLanYaMessge = true
				this.LanYaDataNo = node.DataNo
			},
			openDialogMessge(node) {
				//打开文件上传时的弹窗
				this.dialogMessge = true
				this.fileDataNo = node.DataNo
			},
			clickSendMachine(node) {
				if (node.ConnectedID) {
					this.fileDataNoText = this.fileDataNo = node.DataNo
				} else {
					this.$message.error(node.DataNo + this.$t("onLine.notOnLine"));
				}

			},
			chartUploadChange(file, fileList) {
				this.chartUploadFileNumber = fileList.length;
				//console.log(this.chartUploadFileNumber)
			},
			chartUploadRemove(file, fileList) {
				this.chartUploadFileNumber = fileList.length;
				//console.log(this.chartUploadFileNumber)
			},
			chartUploadBefore(file) {
				this.chartUploadForm.append('file', file, file.name)
				//console.log(file)
				return false
			},
			chartUploadSuccess(ary) {
				//文件发送成功后
				// //console.log(response)
				//console.log(ary)
				let that = this;
				const FILELEN = ary.length;
				let type = "",
					sign = "",
					url = "";
				for (let i = 0; i < FILELEN; ++i) {
					url = ary[i];
					sign = url.indexOf(".jpg") !== -1 ? "img" : url.indexOf(".mp4") !== -1 ? "video" : url.indexOf(".txt") !== -1 ?
						"txt" : "";
					//console.log(url);
					if (sign !== "txt") {
						that.chartData[that.fileDataNo].push({
							type: "web",
							sign: sign,
							value: url
						})
					} else {
						that.chartData[that.fileDataNo].push({
							type: "web",
							sign: sign,
							value: url
						})
					}
				}
				const V = that.sendChartInput;
				that.sendChartInput = " "
				that.$nextTick(function() {
					that.sendChartInput = V
					that.chartUploadFileList = that.chartUploadFileList.splice(0, that.chartUploadFileList.length - 1)
					that.scrollDown()
				})
			},
			judgeChartMachineOnline() {
				if (!this.fileDataNo && !this.fileDataNoText) {
					this.$message.error(this.$t("onLine.chartClickError"));
					return false;
				}
				if (this.fileDataNoText === this.$t("onLine.allMachine")) {
					let str = ""
					const len = this.DeviceData.length
					for (let i = 0; i < len; ++i) {
						if (this.DeviceData[i].ConnectedID) {
							str = "all"
						}
					}
					// str = str.substring(0, str.length - 1)
					if (!str) {
						this.$message.error(this.$t("onLine.machineNotOnLine"));
						return false;
					}
					return str;
				}
				return true;
			},
			sendChart() {
				let that = this;
				let machine_str = that.judgeChartMachineOnline()
				if (!machine_str) {
					return false;
				}
				let id = that.fileDataNo
				if (typeof machine_str === "string") {
					id = " "
					that.fileDataNo = "all"
				}
				if (that.chartUploadFileNumber != 0) {
					if (id === " ") {
						this.$message.error(this.$t("onLine.sendChartNotAllFile"));
						return false;
					}
					that.chartUploadForm.append('client_id', sessionStorage.getItem('comName'))
					that.chartUploadForm.append('client_type', "web")
					that.chartUploadForm.append('file_key', "123")
					that.chartUploadForm.append('login_id', that.userName)
					that.chartUploadForm.append('send_to', id)
					that.chartUploadForm.append('user_id', "")
					//user_id = request["user_id"];
					const CONFIG = {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					};
					that.$axios.post(that.serverUrl + '/DVR/WebServer/PostFile', that.chartUploadForm, CONFIG)
						.then(response => {
							//console.log(response)
							that.chartUploadSuccess(response.data)
							that.chartUploadFileNumber = 0;
							that.chartUploadForm = new FormData();
						})
					that.$refs.chartUploadRef.submit()
					return;
				}

				//发送文字
				if (!that.sendChartInput) return;


				that.chartData[that.fileDataNo].push({
					type: "web",
					sign: "text",
					value: that.sendChartInput
				})

				//发送文字到服务上
				$.ajax({
					type: "get",
					url: that.serverUrl + "/DVR/WebServer/SendMsg",
					contentType: "application/json",
					data: {
						kind: "3",
						strId: id,
						strMsg: this.sendChartInput,
						client_id: sessionStorage.getItem('comName'),
						login_id: that.userName
					},
					success(data) {
						if (data === "Send OK") {
							that.$nextTick(function() {
								that.sendChartInput = ""
								that.scrollDown()
							})
						} else {
							that.$nextTick(function() {
								that.$notify({
									type: 'warning',
									message: that.$t("onLine.sendMesgError")
								});
								that.sendChartInput = ""
							})
						}
					}
				});
			},
			scrollDown() {
				////console.log(this.$refs['myChartScrollbar'])
				if (this.$refs['myChartScrollbar']) this.$refs['myChartScrollbar'].wrap.scrollTop = this.$refs[
					'myChartScrollbar'].wrap.scrollHeight
			},
			allSend() {
				// //console.log("all")
				this.fileDataNoText = this.$t("onLine.allMachine")
			},
			dialogMessgeOpenFile(type, path) {
				this.dialogMessgeOpenFileClickType = type
				this.dialogMessgeOpenFileSrc = path
			},
			sendWarning() {
				//发送警报到后台
				let that = this
				let machine_str = that.judgeChartMachineOnline()
				if (!machine_str) {
					return false;
				}
				let id = that.fileDataNo
				if (typeof machine_str === "string") {
					id = machine_str
					that.fileDataNo = "all"
				}
				that.chartData[that.fileDataNo].push({
					type: "web",
					sign: "warning",
					value: that.sendChartInput
				})
				that.sendChartInput = " "
				$.ajax({
					type: "get",
					url: that.serverUrl + "/DVR/WebServer/SendMsg",
					contentType: "application/json",
					data: {
						kind: "3",
						strId: id,
						strMsg: "30",
						client_id: sessionStorage.getItem('comName'),
						login_id: that.userName
					},
					success: function() {
						if (data === "Send OK") {
							that.$nextTick(function() {
								that.sendChartInput = ""
								that.scrollDown()
							})
						} else {
							that.$nextTick(function() {
								that.$notify({
									type: 'warning',
									message: that.$t("onLine.sendMesgError")
								});
								that.sendChartInput = ""
							})
						}
					}
				});
			},
			noticeServicePlayStopVideo(node) {
				//通知服务播放或是暂停
				console.log("通知服务播放或是暂停")
				console.log(JSON.parse(JSON.stringify(node)))
				let
					that = this,
					kind = 1;
				const DataNo = node.DataNo
				let strMsg = ""
				if (!node.ConnectedID) {
					this.$notify({
						title: this.$t("onLine.warning"),
						type: 'warning',
						message: DataNo + this.$t("onLine.machineNotOnLine")
					});
					return;
				}
				if (node.ViewUrl == '') {
					//需要播放
					if (!that.playState[0] && !that.playState[1] && !that.playState[2] && !that.playState[3]) {
						//没有空闲播放位置
						this.$notify({
							title: this.$t("onLine.warning"),
							type: 'warning',
							message: this.$t("onLine.notVideo")
						});
						return false;
					} else {
						kind = node.Mars4LYOn ? 7 : 1;
					}
					strMsg = "10"
				} else {
					//需要停止
					kind = node.Mars4LYOn ? 8 : 2
					strMsg = "20"
				}
				const Obj = {
					kind: kind,
					strId: DataNo,
					strMsg: "msg!!",
					client_id: sessionStorage.getItem('comName'),
					login_id: that.userName
				};
				console.log(Obj)
				//console.log("通知服务播放或是停止指令", kind)
				$.ajax({
					type: "get",
					url: that.serverUrl + "/DVR/WebServer/SendMsg",
					contentType: "application/json",
					data: Obj,
					success(data) {
						console.log(data)
						if (data !== "Send OK") {
							that.$notify({
								type: 'warning',
								message: that.$t("onLine.playStopVideoFailed")
							});
						}
					}
				});
			},
			playVideo(data) {
				const url = data.ViewUrl
				const DataNo = data.DataNo
				if (this.DataNo[0] != DataNo && this.DataNo[1] != DataNo && this.DataNo[2] != DataNo && this.DataNo[3] != DataNo) {
					//console.log("开始遍历查找播放位置");
					for (let item in this.playState) {
						if (this.playState[item]) {
							this.$set(this.playState, item, false);
							this.$set(this.DataNo, item, DataNo);
							const lastIndex = url.lastIndexOf("/");
							let name = url.substring(lastIndex + 1, url.length);
							let JcScpServer = url.substring(0, lastIndex);
							so.addVariable("JcScpServer", JcScpServer);
							so.addVariable("JcScpVideoPath", name);
							let CuPlayer = "CuPlayer" + item;
							so.write(CuPlayer);
							return;
						}
					}
				}
			},
			stopVideo(data) {
				// //console.log("停止播放")
				const DataNo = data.DataNo
				const len = this.DataNo.length
				for (let i = 0; i < len; ++i) {
					if (this.DataNo[i] === DataNo) {
						this.$set(this.playState, i, true);
						this.$set(this.DataNo, i, "");
						let CuPlayer = "CuPlayer" + i,
							videoElem = $("#" + CuPlayer).find("#myCuPlayer")[0];
						if (videoElem) {
							videoElem.playPauseVideo();
							videoElem.stopVideo();
						} else {
							this.$message.error(this.$t("onLine.checkBrowserFlash"));
						}
					}
				}
			},
			getTreeData(data, DataNo, type) {
				//解析服务传过来的数据
				const len = data.length;
				let that = this;
				//这里首先循坏遍历根节点
				// //console.log("这里首先循坏遍历根节点")
				for (let i = 0; i < len; ++i) {
					const ID = data[i].DataNo
					// data[i].label = ID
					if (data[i].IsMachine) {
						// 						if(DataNo===ID){
						// 							data[i].FileKind = type === "img"?"path4":type === "mp4"?"path3":type === "txt"?"path1":type === "mp3"?"path2":"";
						// 						}
						if ((data[i].ViewOn == true || data[i].Mars4LYViewOn == true) && data[i].ViewUrl != "") {
							this.playVideo(data[i]);
						} else if (data[i].Mars4LYViewOn == false || data[i].ViewOn == false || data[i].ViewUrl == "") {
							this.stopVideo(data[i]);
						}
						const ConnectedID = data[i].ConnectedID
						//这里是聊天模块判断设备下线后仍在和当前设备聊天
						if (!ConnectedID && that.fileDataNo === ID) {
							//下线
							// that.fileDataNo = ""
							// //console.log("判断设备上下线")
							that.$message.error(ID + that.$t("onLine.OfflineUnacceptable"));
						}
						//设备上线
						if (ConnectedID) {
							that.productData.forEach(item => {
								if (data[i].DataType.toLowerCase() === item.productID.toLowerCase()) {
									data[i]['onlineIcon'] = item.productPicpath
									data[i]['onlineColor'] = item.productColor
									// data[i].__proto__.onlineIcon = item.productPicpath
									// data[i].__proto__.onlineColor = item.productColor
								}
							})
						} else {
							// data[i].__proto__.onlineIcon = ""
							// data[i].__proto__.onlineColor = ""
							data[i]['onlineIcon'] = ""
							data[i]['onlineColor'] = ""
						}
						//蓝牙消息处理 吹起中断处理
						if (data[i].Mars4LYMsg.length > 2) {
							const ARY = data[i].Mars4LYMsg.split(";");
							that.dialogLanYaMessgeTableData[ID] instanceof Array || that.$set(that.dialogLanYaMessgeTableData, ID, []);
							let B = that.dialogLanYaMessgeTableData[ID].some((v, n) => {
								if (v.time === ARY[1]) {
									return true;
								}
							})
							if (!B) {
								that.dialogLanYaMessgeTableData[ID].unshift({
									text: ARY[0],
									time: ARY[1],
									face: "",
									img: false
								})
							}

						}

						//地图数据处理
						const name = data[i].DataName;
						let deviceBoolean = this.DeviceData.some((v, i) => {
							return v.DataNo === ID && v.DataName === name
						})
						if (!deviceBoolean) {
							//data[i].value = data[i].DataNo
							let temp = JSON.parse(JSON.stringify(data[i]))
							temp.value = data[i].DataNo
							this.DeviceData.push(temp)
						};
						const NO = 'marker' + ID;
						if (this[NO]) {
							this[NO].setMap(null);
						}
						this[NO] = null;
						//聊天数据结构初始化
						this.chartData[ID] = this.chartData[ID] ? this.chartData[ID] : []
						// //console.log("tree data 完毕")
					}
					//如果children不为null的话再次迭代
					if (data[i].children) {
						this.getTreeData(data[i].children, DataNo, type);
					}
				}
			},
			getTreeFileKindData(data, DataNo, type) {
				//修改树状数据里的FileKind
				const len = data.length;
				let that = this;
				for (let i = 0; i < len; ++i) {
					if (data[i].IsMachine && DataNo === data[i].DataNo) {
						data[i].FileKind = type === "img" ? "path4" : type === "mp4" ? "path3" : type === "txt" ? "path1" : type ===
							"mp3" ? "path2" : "";
					}
					if (data[i].children) {
						this.getTreeFileKindData(data[i].children, DataNo, type);
					}
				}
			},
			getChartUploadFileData(data) {
				const ARY = data.split("⊿");
				let that = this;
				//console.log(ARY)
				const LEN = ARY.length;
				const ID = ARY[0];
				const KIND = ARY[1];
				if (KIND === "alcohol") {
					//蓝牙消息处理
					let lanyaStr = ARY[2];
					const PATH = ARY[3];
					const MESSAGE = lanyaStr.split(";")
					const TEXT = MESSAGE[0].split(",")
					that.dialogLanYaMessgeTableData[ID] instanceof Array || that.$set(that.dialogLanYaMessgeTableData, ID, []);
					that.dialogLanYaMessgeTableData[ID].unshift({
						text: TEXT[1],
						face: MESSAGE[1],
						time: MESSAGE[2],
						img: PATH
					})
				} else if (KIND === "chart") {
					let type = ""
					for (let i = 2; i < LEN; ++i) {
						const PATH = ARY[i];
						const TYPE = PATH.indexOf(".jpg") !== -1 ? "img" : PATH.indexOf(".mp4") !== -1 ? "mp4" : PATH.indexOf(".mp3") !==
							-1 || PATH.indexOf(".wav") !== -1 ? "mp3" : "txt";
						type = TYPE
						let name = PATH.substring(PATH.lastIndexOf("/") + 1, PATH.length);
						// //console.log(name, TYPE, PATH)
						let b = false;
						this.chartData[ID] = this.chartData[ID] ? this.chartData[ID] : []
						switch (TYPE) {
							case "img":
								this.dialogMessgeImgData[ID] = this.dialogMessgeImgData[ID] || []
								b = this.dialogMessgeImgData[ID].some((v, i) => {
									return v.path === PATH
								})
								if (b) break;
								this.chartData[ID].push({
									type: "machine",
									sign: "img",
									value: PATH
								})
								this.dialogMessgeImgData[ID].push({
									name: name,
									path: PATH,
									id: ID
								})
								break;
							case "mp4":
								this.dialogMessgeVideoData[ID] = this.dialogMessgeVideoData[ID] || []
								b = this.dialogMessgeVideoData[ID].some((v, i) => {
									return v.path === PATH
								})
								if (b) break;
								this.chartData[ID].push({
									type: "machine",
									sign: "video",
									value: PATH
								})
								this.dialogMessgeVideoData[ID].push({
									name: name,
									path: PATH,
									id: ID
								})
								break;
							case "mp3":
								this.dialogMessgeAudioData[ID] = this.dialogMessgeAudioData[ID] || []
								b = this.dialogMessgeAudioData[ID].some((v, i) => {
									return v.path === PATH
								})
								if (b) break;
								this.chartData[ID].push({
									type: "machine",
									sign: "audio",
									value: PATH
								})
								this.dialogMessgeAudioData[ID].push({
									name: name,
									path: PATH,
									id: ID
								})
								break;
							case "txt":
								this.dialogMessgeFileData[ID] = this.dialogMessgeFileData[ID] || []
								b = this.dialogMessgeFileData[ID].some((v, i) => {
									return v.path === PATH
								})
								if (b) break;
								this.chartData[ID].push({
									type: "machine",
									sign: "txt",
									value: PATH
								})
								this.dialogMessgeFileData[ID].push({
									name: name,
									path: PATH,
									id: ID
								})
								break;
						}
					}
					this.getTreeFileKindData(this.serverData, ID, type);
					const V = this.sendChartInput;
				}

				this.sendChartInput = " "
				//设备发送消息过来后，把聊天框定位到最下面
				this.$nextTick(() => {
					this.scrollDown()
					this.sendChartInput = ""
				})
			},
			startService() {
				//console.log("进入开启服务")
				let that = this;
				var listener = $.hubConnection(that.serverUrl + "/signalr", {
					useDefaultPath: false
				});
				listener.qs = {
					clientID: sessionStorage.getItem('comName'),
					clientName: that.userName,
					clientType: "web",
					clientOldID: ""
				};
				var hub = listener.createHubProxy("MessageHub");
				hub.on('MachineData', function(message) {
					// //console.log(message)
					message = message.replace(new RegExp('Children', "g"), "children")
					// //console.log(JSON.parse(message))
					// if (JSON.stringify(that.serverData) === message) {
					// 	//console.log("没有重复触发")
					// 	return false;
					// } else {
					console.log("-------数据改变----------");
					// console.log(JSON.parse(JSON.stringify(that.serverData)))
					that.serverData = JSON.parse(message)
					that.DeviceData = []
					that.getTreeData(that.serverData)
					if (that.$refs['myTreeChartScrollbar']) that.treeScrollPosition = that.$refs['myTreeChartScrollbar'].wrap.scrollTop;
					////console.log(that.treeScrollPosition)
					if (that.$route.params.id === 'patrol') {
						if (MAP_TYPE == 1) {
							that.drawMapMachineSign()
						} else if (MAP_TYPE == 2) {
							that.googleDrawMapMachineSign();
						}
					}
					console.log(JSON.parse(JSON.stringify(that.serverData)))
					// }
				});
				hub.on('FileMsg', function(message) {
					//console.log("-------文件信息----------");
					//console.log(message)
					that.getChartUploadFileData(message);
				});
				listener.start().fail(function(message) {}).done(function(data) {
					//console.log('开启服务成功');
					that.connectService();
				});
			},
			connectService() {
				let that = this;
				//连接服务
				$.ajax({
					type: "get",
					contentType: "application/json",
					url: that.serverUrl + "/DVR/WebServer/ConnectSer?client_id=" + sessionStorage.getItem('comName') + "&login_id=" +
						that.userName,
					success: function(data, status) {
						//console.log("连接服务=" + data, status);
					}
				});
			},
			closeService(destroyed) {
				//断开服务
				let that = this;
				var listener = $.hubConnection(that.serverUrl + "/signalr", {
					useDefaultPath: false
				});
				const COMNAME = sessionStorage.getItem('comName');
				listener.qs = {
					clientID: COMNAME,
					clientName: that.userName,
					clientType: "web",
					clientOldID: ""
				};
				var hub = listener.createHubProxy("MessageHub");
				listener.stop();
				hub.on('MachineData', null);
				hub.on('FileMsg', null);
				// //console.log(destroyed);
				if (destroyed) {
					hub.on('MachineData', null);
					hub.on('FileMsg', null);
					return false;
				};
				//console.log("正常开启")
				$.ajax({
					type: "GET",
					url: that.serverUrl + "/DVR/WebServer/DisConnectSer?client_id=" + COMNAME + "&login_id=" + that.userName,
					contentType: "application/json",
					success: function(data, status) {
						//console.log("关闭服务" + data, status)
						if (data == "DisConnected success") {
							that.startService();
						}
					}
				});
			},
			pageaAdaptation() {
				var amain = document.getElementById('main');
				var aonlineBox = amain.getElementsByClassName('onlineBox');
				var asidebar = aonlineBox[0].getElementsByClassName('sidebar');
				var atree = asidebar[0].getElementsByClassName('tree');
				var ahandle = asidebar[0].getElementsByClassName('handle');
				var aasidebarRight = aonlineBox[0].getElementsByClassName('sidebarRight');
				if (asidebar[0].offsetLeft == 0) {
					amain.getElementsByClassName('sidebarRight')[0].style.width = (aonlineBox[0].offsetWidth - '300') + 'px';
				} else {
					amain.getElementsByClassName('sidebarRight')[0].style.width = aonlineBox[0].offsetWidth + 'px';
				}
				const BODYHEIGHT = document.body.scrollHeight
				if (BODYHEIGHT > document.body.offsetHeight) {
					asidebar[0].style.height = "500px";
					atree[0].style.height = "500px";
					ahandle[0].style.height = "500px";
					aasidebarRight[0].style.height = "500px";
				} else {
					const HEIGHT_1 = BODYHEIGHT - 180
					asidebar[0].style.height = HEIGHT_1 + 'px';
					atree[0].style.height = HEIGHT_1 + 'px';
					ahandle[0].style.height = HEIGHT_1 + 'px';
					aasidebarRight[0].style.height = HEIGHT_1 + 'px';
					this.videoHeight = (HEIGHT_1 - 64) / 2 + 'px'
					this.mapsHeight = HEIGHT_1 + "px"
				}
			},
			toggleSider() {
				var amain = document.getElementById('main');
				var asidebar = amain.getElementsByClassName('sidebar')
				var asidebarRight = amain.getElementsByClassName('sidebarRight')
				if (asidebar[0].offsetLeft == 0) {
					var setUp = setInterval(function() {
						if (asidebar[0].offsetLeft > (-300)) {
							asidebar[0].style.left = asidebar[0].offsetLeft - 15 + 'px'
							asidebarRight[0].style.width = asidebarRight[0].offsetWidth + 15 + 'px';
						} else {
							clearInterval(setUp);
						}
					}, 10)
					this.toggleArrow = false;
				} else if (asidebar[0].offsetLeft == -300) {
					var setDown = setInterval(function() {
						if (asidebar[0].offsetLeft < 0) {
							asidebar[0].style.left = asidebar[0].offsetLeft + 15 + 'px'
							asidebarRight[0].style.width = asidebarRight[0].offsetWidth - 15 + 'px';
						} else {
							clearInterval(setDown);
						}
					}, 10)
					this.toggleArrow = true;
				}
			},
		},
		destroyed() {
			//console.log("组件销毁")
			window.onresize = null;
			this.closeService(true);
			this.$axios.interceptors.request.use(null)
		},
		mounted() {
      var so = {};
      so = new SWFObject("./static/player/player.swf", "myCuPlayer", "0", "0", "9", "#000000");
      so.addParam("allowfullscreen", "true");
      so.addParam("allowscriptaccess", "always");
      so.addParam("wmode", "opaque");
      so.addParam("quality", "high");
      so.addParam("salign", "lt");
      so.addVariable("JcScpAutoPlay", "yes"); //是否自动播放
      so.addVariable("JcScpFile", "./static/player/CuSunV4set.xml"); //配置文件
      so.addVariable("ShowJcScpAMoveText", "no"); //是否滚动文字广告
      so.addVariable("ShowJcScpACorner", "no"); //是否滚动文字广告
			let _this = this;
			_this.pageaAdaptation();
			window.onresize = function() {
				_this.pageaAdaptation();
			}
			_this.rc = new Recorder(true);

			this.$nextTick(function() {
				//记得打开浏览器允许flash
				so.addVariable("JcScpServer", "rtmp://192.168.8888.233:554/live"); //流媒体服务器
				so.addVariable("JcScpVideoPath", "M0000002"); //直播流名称
				const s = "CuPlayer"
				var CuPlayer = s + 0;
				so.write(CuPlayer);
				CuPlayer = s + 1;
				so.write(CuPlayer);
				CuPlayer = s + 2;
				so.write(CuPlayer);
				CuPlayer = s + 3;
				so.write(CuPlayer);
				console.log(MAP_TYPE)
				if (MAP_TYPE == 1) {
					const language = localStorage.getItem("languageType");
					let lang = language === 'zh-CN' ? 'zh_cn' : language === 'en-US' ? 'en' : 'zh_en'
					map = new AMap.Map("container", {
						resizeEnable: true,
						zoom: 11, //初始化地图层级
						lang: lang
					})
					map.on('zoomend', function(e) {
						_this.mapZoom = map.getZoom()
					});
				}

				_this.pageaAdaptation();
			})
		},
	}
	/**
	 * Created by Wandergis on 2015/7/8.
	 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
	 * coordtransform.js
	 */
	//UMD魔法代码
	// if the module has no dependencies, the above pattern can be simplified to
	{

		if (typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define([], getMapsLngLat);
		} else if (typeof module === 'object' && module.exports) {
			// Node. Does not work with strict CommonJS, but
			// only CommonJS-like environments that support module.exports,
			// like Node.
			module.exports = getMapsLngLat();
		} else {
			// Browser globals (root is window)
			window.coordtransform = getMapsLngLat();
		}
	}

	// }(this));
	function getMapsLngLat() {
		//定义一些常量
		var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
		var PI = 3.1415926535897932384626;
		var a = 6378245.0;
		var ee = 0.00669342162296594323;
		/**
		 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
		 * 即 百度 转 谷歌、高德
		 * @param bd_lon
		 * @param bd_lat
		 * @returns {*[]}
		 */
		var bd09togcj02 = function bd09togcj02(bd_lon, bd_lat) {
			var bd_lon = +bd_lon;
			var bd_lat = +bd_lat;
			var x = bd_lon - 0.0065;
			var y = bd_lat - 0.006;
			var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
			var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
			var gg_lng = z * Math.cos(theta);
			var gg_lat = z * Math.sin(theta);
			return [gg_lng, gg_lat]
		};

		/**
		 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
		 * 即谷歌、高德 转 百度
		 * @param lng
		 * @param lat
		 * @returns {*[]}
		 */
		var gcj02tobd09 = function gcj02tobd09(lng, lat) {
			var lat = +lat;
			var lng = +lng;
			var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
			var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
			var bd_lng = z * Math.cos(theta) + 0.0065;
			var bd_lat = z * Math.sin(theta) + 0.006;
			return [bd_lng, bd_lat]
		};

		/**
		 * WGS84转GCj02
		 * @param lng
		 * @param lat
		 * @returns {*[]}
		 */
		var wgs84togcj02 = function wgs84togcj02(lng, lat) {
			var lat = +lat;
			var lng = +lng;
			if (out_of_china(lng, lat)) {
				return [lng, lat]
			} else {
				var dlat = transformlat(lng - 105.0, lat - 35.0);
				var dlng = transformlng(lng - 105.0, lat - 35.0);
				var radlat = lat / 180.0 * PI;
				var magic = Math.sin(radlat);
				magic = 1 - ee * magic * magic;
				var sqrtmagic = Math.sqrt(magic);
				dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
				dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
				var mglat = lat + dlat;
				var mglng = lng + dlng;
				return [mglng, mglat]
			}
		};

		/**
		 * GCJ02 转换为 WGS84
		 * @param lng
		 * @param lat
		 * @returns {*[]}
		 */
		var gcj02towgs84 = function gcj02towgs84(lng, lat) {
			var lat = +lat;
			var lng = +lng;
			if (out_of_china(lng, lat)) {
				return [lng, lat]
			} else {
				var dlat = transformlat(lng - 105.0, lat - 35.0);
				var dlng = transformlng(lng - 105.0, lat - 35.0);
				var radlat = lat / 180.0 * PI;
				var magic = Math.sin(radlat);
				magic = 1 - ee * magic * magic;
				var sqrtmagic = Math.sqrt(magic);
				dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
				dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
				var mglat = lat + dlat;
				var mglng = lng + dlng;
				return [lng * 2 - mglng, lat * 2 - mglat]
			}
		};

		var transformlat = function transformlat(lng, lat) {
			var lat = +lat;
			var lng = +lng;
			var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
			ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
			ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
			return ret
		};

		var transformlng = function transformlng(lng, lat) {
			var lat = +lat;
			var lng = +lng;
			var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
			ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
			ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
			return ret
		};

		/**
		 * 判断是否在国内，不在国内则不做偏移
		 * @param lng
		 * @param lat
		 * @returns {boolean}
		 */
		var out_of_china = function out_of_china(lng, lat) {
			var lat = +lat;
			var lng = +lng;
			// 纬度3.86~53.55,经度73.66~135.05
			return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
		};

		return {
			bd09togcj02: bd09togcj02,
			gcj02tobd09: gcj02tobd09,
			wgs84togcj02: wgs84togcj02,
			gcj02towgs84: gcj02towgs84
		}
	}
</script>
<style lang="scss">
	.xh-tree ul {
		margin: 0 0 0 15px;
		font-size: 14px;
	}

	.xh-tree>ul {
		margin: 0;
	}

	.tree-search-box {
		height: 60px;
		line-height: 60px;
		padding: 0 10px;
	}

	.enlarge-img {
		max-width: 100%;
	}

	.chart {
		position: fixed;
		width: 195px;
		bottom: 60px;
		right: 0;
		text-align: center;

	}

	.chart .el-collapse-item__content {
		padding-bottom: 0;
	}

	.chart .el-collapse-item__arrow.el-icon-arrow-right {
		display: none;
	}

	.chart .el-collapse-item__header {
		height: 30px;
		line-height: 30px;
		// background: #138ce6;
		color: white;
		overflow: hidden;
	}



	.chart-icon-box {
		cursor: pointer;
	}

	.chart .el-scrollbar {
		height: 100%;
	}

	.tree .el-scrollbar {
		height: 90%;
	}

	.chart .el-scrollbar__wrap,
	.tree .el-scrollbar__wrap {
		overflow: scroll;
		overflow-x: hidden;
	}

	.chart-box li {
		padding: 8px 0;
		margin: 8px 0;
		// background: white;
		border-radius: 5px;
	}

	.chart-content-box {
		display: inline-block;
		background: white;
		padding: 2px 10px;
		border-radius: 4px;
		position: relative;
		margin: 0 10px;
		max-width: 80%;
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-wrap !important;
		vertical-align: top;
	}

	.chart-content-box::after {
		content: "";
		display: block;
		position: absolute;
		border: 7px solid transparent;
	}

	.chart-machine .chart-content-box::after {
		top: 6px;
		left: -14px;
		border-right: 7px solid white;
	}

	.chart-web .chart-content-box::after {
		top: 6px;
		right: -13px;
		border-left: 7px solid white;
	}



	.dialogMessgeImg-box-footer {
		padding: 0px !important;
	}

	.dialogMessgeImg-box-footer .el-button.el-button--primary.el-button--small {
		color: #50bfff;
		padding: 7px 15px;
		background: #f5f7fa;
		border-left: none;
		margin-left: -8px;
		border-color: #dcdfe6;
	}

	.dialogMessgeImg-box-footer .el-upload-list.el-upload-list--text {
		position: absolute;
		top: -95px;
		right: 5px;
		text-align: left;
		box-shadow: 0 0 1px;
		height: 95px;
		overflow: auto;
	}

	.dialogMessgeImg-box-footer .el-input-group__append {
		border-right: none;
	}

	.dialogMessgeImg-chart-media {
		width: 100px;
		height: 70px;
		vertical-align: top;
	}

	.dialogMessgeImg-chart-video {
		width: 200px;
		height: 156px;
		vertical-align: bottom;
	}

	.chart-machine {
		text-align: left;
		margin: 5px;
	}

	.chart-web {
		text-align: right;
		margin: 5px;
	}

	.chart-drag {
		position: absolute;
		top: 0px;
		left: 0px;
		text-align: left;
		text-indent: 5px;
		// background: #138ce6;
		width: 40px;
		color: white;
		cursor: move;
		// border-top: 1px solid #138ce6;
		transition: width, left .4s;
	}

	.chart-drag:hover {
		left: -40px;
		width: 80px;
	}

	.dialog-jj-img {
		max-width: 100%;
		max-height: 200px;
	}

	@keyframes ZoomIn {
		from {
			opacity: 1
		}

		to {
			opacity: 0.8
		}
	}

	.audio-recording {
		color: #50bfff !important;
		animation: ZoomIn 1s infinite;
	}

	.well-4g-icon-yuyin {
		font-size: 20px;
		// color: #000;
	}

	.audio-send {
		font-size: 20px !important;
	}

	.maps-tips-box {
		left: 0px;
		position: absolute;
		bottom: 0;
		width: 175px;
		background: white;
		padding: 0px 10px 10px 10px;
		border-bottom-left-radius: 5px;
		border-top-left-radius: 5px;
		z-index: 999;
	}

	.input-card {
		width: 16rem;
		z-index: 170;
	}

	.input-card .btn {
		margin-right: .8rem;
	}

	.input-card .btn:last-child {
		margin-right: 0;
	}

	.dataNo-label {
		font-size: 14px;
	}

	.machine-icon {
		font-size: 14px;
		// color: #1E9FFF;
		margin-left: 2px;
		cursor: pointer;
		padding: 0;
		border: none;
		vertical-align: middle;
	}

	.dialogMessgeImg-content {
		width: 100%;
		height: 400px;
	}

	.dialog-messge-ul li {
		text-indent: 10px;
		padding: 5px;
		color: #737373;
		font-size: 0.7em;
		cursor: pointer;
	}

	.dialog-messge-ul li:hover {
		color: #00B791;
	}

	#container {
		min-height: 500px;
	}

	.video-box {
		width: 100%;
		min-height: 230px;
	}

	.card-title {
		height: 20px;
		line-height: 20px;
		text-indent: 10px;
		padding: 5px;
	}

	.onlineBox {
		position: relative;

		.sidebar {
			position: absolute;
			left: 0px;
			width: 300px;

			.tree {
				float: left;
				width: 280px;
				background: #fff;
				border-radius: 5px;
				overflow: hidden;
			}

			.handle {
				width: 20px;
				float: left;

				// height: 100px;
				// background: #f00;
				.handleBox {
					width: 10px;
					height: 100%;
					background: rgba(0, 0, 0, 0);
					margin: 0px 5px;
					border-radius: 5px;
					position: relative;

					&:hover {
						background: rgba(0, 0, 0, .1);
					}

					.handleBoxClick {
						width: 12px;
						height: 36px;
						border-radius: 6px;
						cursor: pointer;
						position: absolute;
						left: 50%;
						top: 50%;
						margin-left: -6px;
						margin-top: -16px;

						i {
							display: block;
							width: 12px;
							height: 12px;
							// color: #fff;
							margin-top: 12px;

							&::before {
								// background: #fff;
								width: 12px;
								height: 12px;
								display: block;
								font-size: 12px;
								color: #fff;
								font-weight: bold;
							}
						}
					}
				}
			}
		}

		.sidebarRight {
			position: relative;
			float: right;
			background: #fff;
			border-radius: 5px;
		}
	}
</style>
