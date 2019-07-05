<template>
	<div id="home">
		<el-scrollbar style="height:100%;" :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle="" :noresize="true"
		 tag="section">
			<div :style="{height:style.homeHeight}">
				<el-container>
					<el-main style="padding:0;">
						<el-card style="margin:20px 0" shadow="always" :body-style="{padding:'10px 20px'}">
							<div class="card-header">
								<h4>{{$t('home.flowChart')}}</h4>
							</div>
							<div class="card-content">
								<el-row :gutter="30">
									<el-col :span="5">
										<p class="flow-text right-tip bg-E8EBEF">{{$t('home.newUserRegister')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFEBEE">{{$t('home.loginBackstageSystem')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-E3F2FD">{{$t('home.entryDepartmentInfo')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFF3E0">{{$t('home.entryStaffMemberInfo')}}</p>
									</el-col>

								</el-row>
								<el-row :gutter="30" style="margin-top:10px;">
									<el-col :span="5">
										<p class="flow-text right-tip bg-E8EBEF">{{$t('home.configureFaceStandard')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFEBEE">{{$t('home.configureWineStandard')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-E3F2FD">{{$t('home.entryDeviceInfo')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFF3E0">{{$t('home.deviceLoginAccountNumber')}}</p>
									</el-col>
								</el-row>
								<el-row :gutter="30" style="margin-top:10px;">
									<el-col :span="5">
										<p class="flow-text right-tip bg-E8EBEF">{{$t('home.entryDeviceUser')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFEBEE">{{$t('home.bindUserRelationship')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-E3F2FD">{{$t('home.deviceSweepCodeLogin')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFF3E0">{{$t('home.bindLoginRelationship')}}</p>
									</el-col>


								</el-row>
								<el-row :gutter="30" style="margin-top:10px;">
									<el-col :span="5">
										<p class="flow-text right-tip bg-E8EBEF">{{$t('home.inLineListOnLine')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-FFEBEE">{{$t('home.goWineFaceing')}}</p>
									</el-col>
									<el-col :span="5">
										<p class="flow-text right-tip left-tip bg-E3F2FD">{{$t('home.manageUploadData')}}</p>
									</el-col>
								</el-row>
							</div>
						</el-card>
						<el-card style="margin:20px 0" shadow="always" :body-style="{padding:'10px 20px'}">
							<div class="card-header">
								<h4>{{$t('home.statistics')}}</h4>
								<el-button class="card-right-icon" type="text">
									<el-dropdown @command="statisticsCommand">
										<span class="el-dropdown-link">
											<i class="el-icon-more"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="a">{{$t('home.update')}}</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</el-button>
							</div>
							<div class="card-content" v-loading="statisticsLoading">
								<el-container>
									<el-main style="padding:0;overflow: hidden;">
										<el-row>
											<el-col :span="8" class="progress-box">
												<div id="statisticsEcharts"></div>
												<el-row type="flex" style="margin-top:40px;" justify="space-around">
													<el-col :span="12">
														<p>{{$t('home.totalEquipment')}}</p>
														<span>{{deviceData.length}}</span>
													</el-col>
													<el-col :span="12">
														<p>{{$t('home.totalUpload')}}</p>
														<span>{{uploadDataLength}}</span>
													</el-col>
												</el-row>
											</el-col>
											<el-col :span="16">
												<el-row type="flex" justify="space-around">
													<el-col :span="22" class="swiper-flex">
														<p class="statistics-header" style="margin-bottom: 10px"><i class="el-icon-check"></i>
															{{$t('home.uploadImg')}} <strong>{{uploadImgData.length}}</strong></p>
														<viewer :images="uploadImgData" v-if="uploadImgData.length">
															<swiper :options="swiperOption">
																<swiper-slide v-for="(item,index) in uploadImgData" :key="index">
																	<img :src="item.devicefDtlPath" :style="{width:swiperWidth,height:swiperHeight}" class="carousel-img">
																</swiper-slide>
															</swiper>
														</viewer>
													</el-col>
												</el-row>
												<el-row type="flex" justify="space-around">
													<el-col :span="22">
														<p class="statistics-header" style="margin-bottom: 10px"><i class="el-icon-check"></i>
															{{$t('home.uploadVideo')}} <strong>{{uploadVideoData.length}}</strong></p>
														<swiper :options="swiperOption">
															<swiper-slide v-for="(item,index) in uploadVideoData" :key="index">
																<video @click="clickCarousel(item)" class="carousel-video" :style="{width:swiperWidth,height:swiperHeight}"
																 :src="item.devicefDtlPath">{{$t('home.notUseHtml5')}}</video>
															</swiper-slide>
														</swiper>
													</el-col>
												</el-row>
												<el-row type="flex" justify="space-around">
													<el-col :span="22">
														<el-collapse accordion style="border:none;">
															<el-collapse-item name="1">
																<template slot="title">
																	<p class="statistics-header"><i class="el-icon-check"></i> {{$t('home.uploadAudio')}} <strong>{{uploadAudioData.length}}</strong></p>
																</template>
																<div class="collapse-box" v-for="(item,index) in uploadAudioData" :key="index" @click.stop="palyAudio($event)">
																	<span class="collapse-text">{{$t('home.equipmentNumber')}}：{{item.deviceId}}</span>
																	<span class="collapse-text">{{$t('home.createTime')}}：{{item.devicefDtlCreatetime.replace("T"," ").substring(0,item.devicefDtlCreatetime.replace("T"," ").indexOf("."))}}</span>
																	<span class="chart-audio-machine-content chart-content-box">
																		<i class="iconfont well-4g-icon-yuyin1"></i>
																		<audio :src="item.devicefDtlPath"></audio>
																	</span>
																</div>
															</el-collapse-item>
														</el-collapse>
													</el-col>
												</el-row>
											</el-col>
										</el-row>
									</el-main>
								</el-container>
							</div>
						</el-card>
					</el-main>
					<el-aside width="230px" style="margin-left: 10px;">

						<el-card shadow="always" v-loading="staffMemberLoading" style="margin:20px 0" :body-style="{padding:'10px 20px'}">
							<div class="card-header">
								<h4>{{$t('home.overview')}}</h4>
								<el-button class="card-right-icon" type="text">
									<el-dropdown @command="staffMemberCommand">
										<span class="el-dropdown-link">
											<i class="el-icon-more"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="a">{{$t('home.update')}}</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</el-button>
							</div>
							<div class="card-content overview-box">
								<div class="inline-block div1">
									<p>{{$t('home.allPerson')}}</p>
									<h1>{{staffMemberData.length}}</h1>
									<router-link to="/organize/staff"><i class="el-icon-back"></i>{{$t('home.viewAll')}}</router-link>
								</div>
								<div class="inline-block div1">
									<p>{{$t('home.totalEquipment')}}</p>
									<h1>{{deviceData.length}}</h1>
									<router-link to="/device/device"><i class="el-icon-back"></i>{{$t('home.viewAll')}}</router-link>
								</div>
								<div class="inline-block div1">
									<p>{{$t('home.allUserEquipment')}}</p>
									<h1>{{dviceUserData.length}}</h1>
									<router-link to="/device/deviceUser"><i class="el-icon-back"></i>{{$t('home.viewAll')}}</router-link>
								</div>
							</div>
						</el-card>
					</el-aside>
				</el-container>
				<el-card :body-style="{padding:'10px 20px'}">
					<swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop">
						<swiper-slide v-for="(item,index) in carousel" :key="index">
							<img class="carousel-img carousel-sign-img" :style="{height:style.carouselHeight}" :src="item" alt="" />
						</swiper-slide>
						<div class="swiper-button-next swiper-button-white" slot="button-next"></div>
						<div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
					</swiper>
					<swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
						<swiper-slide v-for="(item,index) in carousel" :key="index">
							<img class="carousel-img carousel-sign-img" :src="item" alt="" />
						</swiper-slide>
					</swiper>
				</el-card>
			</div>
			<el-dialog v-dialogDrag ref="dialog__wrapper" :title="$t('common.video')" :visible.sync="videoVisible" width="680px"
			 v-if="videoVisible">
				<span>
					<video :src="enlargeVideoUrl" width="640" controls>{{$t('home.notUseHtml5')}}</video>
				</span>
			</el-dialog>
		</el-scrollbar>
	</div>
</template>

<script>
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入柱状图、折线图
	require('echarts/lib/chart/bar');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
	require('echarts/lib/chart/pie');

	export default {
		data() {
			return {
				videoVisible: false,
				enlargeVideoUrl: '',
				carousel: [
					require('../../assets/img/4DGVR1.png'),
					require('../../assets/img/b-2.png'),
					require('../../assets/img/b-3.png'),
					require('../../assets/img/b-4.png'),
					require('../../assets/img/b-5.png'),
				],
				style: {
					carouselHeight: "",
					homeHeight: ""
				},
				userName: sessionStorage.getItem('user_name'),
				dialogLanYaMessgeTableData: {},
				dialogLanYaMessge: false,
				LanYaDataNo: "",
				uploadImgData: [],
				uploadVideoData: [],
				uploadAudioData: [],
				uploadTextData: [],
				deviceData: [],
				dviceUserData: [],
				statisticsLoading: false,
				staffMemberLoading: false,
				staffMemberData: [],
				swiperOption: {
					slidesPerView: 5,
					spaceBetween: 15,
					autoplay: {
						delay: 2500,
						disableOnInteraction: false
					}
				},
				swiperOptionTop: {
					spaceBetween: 10,
					loop: true,
					loopedSlides: 5, //looped slides should be the same
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					}
				},
				swiperOptionThumbs: {
					spaceBetween: 10,
					slidesPerView: 4,
					touchRatio: 0.2,
					loop: true,
					loopedSlides: 5, //looped slides should be the same
					slideToClickedSlide: true,
				},
				swiperWidth: "",
				swiperHeight: ""
			};
		},
		props: ["language"],
		watch: {
			language(n, o) {
				//console.log.log(n)
				if (n != o) {
					this.drawCharts();
				}
			}
		},
		destroyed() {
			this.$axios.interceptors.request.use(null)
			window.onresize = null;
		},
		created() {
			this.$axios.interceptors.request.use(
				config => {
					config.headers.Authorization = sessionStorage.getItem('loginPrefix') + " " + sessionStorage.getItem('loginToken');
					return config;
				},
				error => {
					return Promise.reject(error);
				}
			);
			this.getDevicefiledtlData()
			this.getStaffMember()
			this.style.homeHeight = document.body.clientHeight - 180 + "px";
			let that = this;

		},
		mounted() {
			let that = this;
			let img = new Image();
			img.src = that.carousel[0];
			const Number = img.width / img.height;
			const CarouselWidth = $(".carousel-sign-img:eq(0)").width();
			that.$nextTick(() => {
				img.onload = function() {
					that.style.carouselHeight = Math.floor(CarouselWidth / Number) + "px";
				}
				const swiperTop = this.$refs.swiperTop.swiper
				const swiperThumbs = this.$refs.swiperThumbs.swiper
				swiperTop.controller.control = swiperThumbs
				swiperThumbs.controller.control = swiperTop
			})
			window.onresize = () => {
				that.style.homeHeight = document.body.clientHeight - 180 + "px";
				that.style.carouselHeight = Math.floor($(".carousel-sign-img:eq(0)").width() / Number) + "px";
			};
		},
		computed: {
			uploadDataLength() {
				return this.uploadImgData.length + this.uploadVideoData.length + this.uploadAudioData.length
			}
		},
		methods: {
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
			drawCharts() {
				let that = this
				let statisticsEcharts = echarts.init(document.getElementById('statisticsEcharts'));
				const option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)",
						position: function(point, params, dom, rect, size) {
							//其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
							var x = point[0]; //
							var y = point[1];
							var viewWidth = size.viewSize[0];
							var viewHeight = size.viewSize[1];
							var boxWidth = size.contentSize[0];
							var boxHeight = size.contentSize[1];
							var posX = 0; //x坐标位置
							var posY = 0; //y坐标位置
							if (x < boxWidth) { //左边放不开
								posX = 5;
							} else { //左边放的下
								posX = x - boxWidth;
							}
							if (y < boxHeight) { //上边放不开
								posY = 5;
							} else { //上边放得下
								posY = y - boxHeight;
							}
							return [posX, posY];
						}
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: [that.$t("home.image"), that.$t("home.files"), that.$t("home.audio"), that.$t("home.video")]
					},
					series: [{
						name: that.$t("home.number"),
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: [{
								value: that.uploadImgData.length,
								name: that.$t("home.image")
							},
							{
								value: that.uploadTextData.length,
								name: that.$t("home.files")
							},
							{
								value: that.uploadAudioData.length,
								name: that.$t("home.audio")
							},
							{
								value: that.uploadVideoData.length,
								name: that.$t("home.video")
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};
				that.$nextTick(() => {
					statisticsEcharts.setOption(option);
					that.statisticsLoading = false;
				})
			},
			getStaffMember() {
				let that = this;
				that.staffMemberLoading = true;
				that.$axios.post(NEW_URL_CONFIG + "/api/employee/select/base", {
					"pageIndex": 1,
					"pageSize": 99999,
				}).then(res => {
					//console.log.log(res)
					if (res.data.statusCode === 407 || res.data.statusCode === 402) {
						that.goLogin();
						that.staffMemberLoading = false;
						return false;
					}
					that.staffMemberData = res.data.data.resultObjects
					that.$axios.post(NEW_URL_CONFIG + "/api/deviceUser/select/base", {
						"pageIndex": 1,
						"pageSize": 99999,
					}).then(res1 => {
						//console.log.log(res1)
						that.dviceUserData = res1.data.data.resultObjects
						that.staffMemberLoading = false;
					})

				})
			},
			staffMemberCommand(command) {
				if (command === "a") {
					this.getStaffMember();
				}
			},
			statisticsCommand(command) {
				if (command === "a") {
					this.uploadImgData = []
					this.uploadAudioData = []
					this.uploadVideoData = []
					this.uploadTextData = []
					this.getDevicefiledtlData();
				}
			},
			palyAudio(e) {
				let audio = $(e.target).parent().find("audio")[0]
				audio.paused ? audio.play() : audio.pause();
			},
			clickCarousel(val) {
				this.videoVisible = true;
				this.enlargeVideoUrl = val.devicefDtlPath;
			},
			getDevicefiledtlData() {
				let that = this;
				that.statisticsLoading = true;

				that.$axios.post(NEW_URL_CONFIG + "/api/device/select", {}).then(ress => {
					//console.log.log(ress)
					if (ress.data.statusCode === 407 || ress.data.statusCode === 402) {
						that.goLogin();
						that.staffMemberLoading = false;
						return false;
					}
					that.deviceData = ress.data.data.resultObjects;
					that.$axios.post(NEW_URL_CONFIG + "/api/devicefiledtl/home/select", {}).then(res => {
						const data = res.data.data
						const LEN = data.resultObjects.length;
						let img = document.createElement("img");
						//console.log.log(img.src)
						//console.log.log(JSON.parse(JSON.stringify(data.resultObjects)))
						for (let i = 0; i < LEN; ++i) {
							switch (data.resultObjects[i].devicefType) {
								case "jpg":
									if (that.uploadImgData.length > 10) break;
									if (!img.src) {
										img.src = data.resultObjects[i].devicefDtlPath
										img.onload = (res) => {
											that.swiperWidth = img.width / img.height * 100 + "px";
											that.swiperHeight = (img.width / img.height * 100) * 10 / 16 + "px";
										}
									}
									that.uploadImgData.unshift(data.resultObjects[i])
									break;
								case "mp3":
									if (that.uploadAudioData.length > 10) break;
									that.uploadAudioData.unshift(data.resultObjects[i])
									break;
								case "mp4":
									if (that.uploadVideoData.length > 10) break;
									that.uploadVideoData.unshift(data.resultObjects[i])
									break;
								case "txt":
									if (that.uploadTextData.length > 10) break;
									that.uploadTextData.unshift(data.resultObjects[i])
									break;
							}
						}
						that.drawCharts();
						// that.loadVideo();
					})
				})

			}
		}
	}
</script>
<style scoped>
	h4 {
		font-weight: 900;
	}

	h4,
	p {
		font-size: 14px;
		margin: 0;
	}

	.overview-box {
		text-align: center;
	}

	.div1>a {
		background: #0c64eb;
		color: white;
		border-radius: 12px;
		padding: 5px 8px;
		font-size: 13px;
	}

	.div1>a>i {
		background: rgba(0, 0, 0, .2);
		font-size: 12px;
		border-radius: 50%;
		padding: 5px;
	}

	.div1 {
		margin: 60px auto;
	}

	.div1 h1 {
		font-size: 32px;
		margin: 10px;
	}

	.statistics-text p {
		font-size: 13px;
		text-align: right;
	}

	.statistics-header i {
		color: white;
		background: #00bb00;
		border-radius: 50%;
	}

	.progress-box {
		text-align: center;

	}

	.progress-box span,
	.progress-box p {
		font-size: 12px;
	}

	.progress-box span {
		color: #aaa;
	}

	.statistics-ul {
		margin: 10px 0;
		height: 200px;
	}

	.statistics-ul li {
		margin: 10px 0;
		font-size: 14px;
		color: #838A9D;
	}

	.bg-E8EBEF {
		background: #E8EBEF;
	}

	.right-tip.bg-E8EBEF::after {
		border-left-color: #E8EBEF;
	}

	.bg-E3F2FD {
		background: #E3F2FD;
	}

	.right-tip.bg-E3F2FD::after {
		border-left-color: #E3F2FD;
	}

	.left-tip.bg-E3F2FD::before {
		border-top-color: #E3F2FD;
		border-bottom-color: #E3F2FD;
	}

	.bg-FFF3E0 {
		background: #FFF3E0;
	}

	.right-tip.bg-FFF3E0::after {
		border-left-color: #FFF3E0;
	}

	.left-tip.bg-FFF3E0::before {
		border-top-color: #FFF3E0;
		border-bottom-color: #FFF3E0;
	}

	.bg-FFEBEE {
		background: #FFEBEE;
	}

	.right-tip.bg-FFEBEE::after {
		border-left-color: #FFEBEE;
	}

	.left-tip.bg-FFEBEE::before {
		border-top-color: #FFEBEE;
		border-bottom-color: #FFEBEE;
	}

	.bg-F3E5F5 {
		background: #F3E5F5;
	}

	.right-tip.bg-F3E5F5::after {
		border-left-color: #F3E5F5;
	}

	.left-tip.bg-F3E5F5::before {
		border-top-color: #F3E5F5;
		border-bottom-color: #F3E5F5;
	}

	.flow-text {
		text-align: center;
		padding: 5px 0px;
		position: relative;
		height: 30px;
		box-sizing: border-box;
		text-indent: 10px;
		font-size: 13px;
		line-height: 22px;
	}

	.right-tip {
		color: #838A9D;
	}

	.right-tip::after {
		content: "";
		display: block;
		border: 15px solid transparent;
		position: absolute;
		right: -30px;
		top: 50%;
		margin-top: -15px;
	}


	.left-tip::before {
		content: "";
		display: block;
		border: 15px solid transparent;
		position: absolute;
		left: -15px;
		top: 50%;
		margin-top: -15px;
	}

	/* .card-content .list {
		font-size: 13px;
		margin: 10px 0;
	} */

	/* .line {
		position: relative;
	}

	.line::after {
		content: "";
		display: inline-block;
		width: 1px;
		height: 20px;
		background: #bbbbbb;
		position: absolute;
		left: 100px;
		top: -15px;
	} */

	/* .list span {
		display: inline-block;
		vertical-align: middle;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.list .span1 {
		width: 84px;
	}

	.list .span3 {
		width: 245px;
	} */

	.round {
		width: 7px;
		height: 7px;
		background: #bbb;
		border-radius: 50%;
		margin: 0 9px;
	}

	.card-right-icon span {
		display: inline-block;
		vertical-align: middle;
		color: #999;
		margin-right: 5px;
	}

	/* .home-steps {
		height: 100px;
	} */

	/* .card-header-title2 {
		margin: 0 0 0 20px;
	} */

	/* .text-center {
		text-align: center;
	} */


	.card-header h4 {
		float: left;
	}

	.card-content {
		clear: both;
		padding: 10px 0;
	}

	/* .font-color-gray {
		color: #838a9d;
	} */

	.card-right-icon {
		float: right;
		padding: 3px;
	}

	.card-right-icon i:hover {
		background-color: #eee;

	}

	.card-right-icon i {
		transform: rotate3d(0, 0, 100, 90deg);
		font-size: 18px;
		color: #3c4353;
		padding: 3px;
		border-radius: 50%;
	}

	.carousel-img,
	.carousel-video {
		width: 100%;
		height: 100%;
		max-width: 100%;
		object-fit: fill;
		border-radius: 5px;
	}

	.swiper-flex .carousel-img,
	.swiper-flex .carousel-video {
		height: 100px;
	}

	.collapse-text {
		height: 34px;
		display: inline-block;
		line-height: 34px;
		vertical-align: middle;
		cursor: pointer;
	}

	.collapse-box:hover {
		color: #bd3636;
	}

	#statisticsEcharts {
		width: 250px;
		height: 200px;
	}
</style>
