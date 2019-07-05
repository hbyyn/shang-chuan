<template>
	<div>
			<li :class="{'parent_li':!item.IsMachine}" v-for="(item,index) in model" :key='index'>
				<span @click.stop="switchTree($event)" v-if="!item.IsMachine"><i class="iconfont well-4g-icon-bumen"></i> {{item.DataName}}</span>
				<span :data-label="item.DataNo" :style="{'color':item.onlineColor?item.onlineColor+'!important':'inherit'}" :class="{'machine-onLine': item.ConnectedID}"  class="isMachine search-label" v-if="item.IsMachine">
					<!-- <i class="iconfont well-4g-icon-bumen"></i> -->
					<!-- :style="{'color':item.onlineColor?item.onlineColor:'inherit'}" -->
					<i class="iconfont well-4g-icon-jiujia" v-show="!item.onlineIcon" ></i>
					<img class="xh_icon" :src="item.onlineIcon" v-show="item.onlineIcon" />
					<font v-if="pageItem==0">
						<font @click="clickSendMachine(item)">{{item.DataNo}}</font>
						<i class="iconfont" :class="{'well-4g-icon-bofang':(!item.ViewUrl&&!item.Mars4LYViewOn)||(!item.ViewUrl&&item.Mars4LYViewOn),'well-4g-icon-zanting':item.ViewUrl&&item.Mars4LYViewOn}"
						 @click="noticeServicePlayStopVideo(item)" v-if="item.Mars4LYOn"></i>
             <i class="iconfont" :class="{'well-4g-icon-bofang':(!item.ViewUrl||!item.ViewOn),'well-4g-icon-zanting':(item.ViewUrl&&item.ViewOn)}"
						 @click="noticeServicePlayStopVideo(item)" v-else></i>
            <!-- <i class="iconfont" :class="{'well-4g-icon-bofang':item.ViewUrl==''&&(!item.ViewOn||!item.Mars4LYViewOn),'well-4g-icon-zanting':item.ViewUrl!=''&&(item.ViewOn||item.Mars4LYViewOn)}"
						 @click="noticeServicePlayStopVideo(item)"></i> -->
						<i class="iconfont" :class="{'well-4g-icon-weibiaoti1':item.FileKind=='path1' ,'well-4g-icon-yinpin':item.FileKind=='path2' ,'well-4g-icon-zhibo':item.FileKind=='path3' ,'well-4g-icon-tupian':item.FileKind=='path4' }"
						 @click="openDialogMessge(item)"></i>
						<i class="el-icon-bell animation-shake" style="color:red;font-weight: 600;" v-if="item.Waring" @click="item.Waring = ''"></i>
						<i class="iconfont well-4g-icon-lanya animation-twinkle" v-if="item.Mars4LYOn" :class="{'animation-twinkle':item.Mars4LYMsg!=''}"
						 @click="loadLanYaMesg(item)"></i>
					</font>
					<font v-if="pageItem==1">
						<font @click="clickJiQi(item)">{{item.DataNo}}</font>
						<i @click="location(item)" class="machine-icon iconfont well-4g-icon-dingwei"></i>
						<i @click="mapsCheckRoter(item)" class="machine-icon iconfont well-4g-icon-chakan"></i>
						<i @click="mapsSetRoutePop(item)" class="machine-icon iconfont well-4g-icon-xunluoguanli"></i>
						<i @click="mapsBindClick(item)" class="machine-icon el-icon-plus"></i>
					</font>

				</span>

				<ul v-if="!item.IsMachine">
					<xhTree
						@noticeServicePlayStopVideo-a="noticeServicePlayStopVideo"
						@openDialogMessge-a="openDialogMessge"
						@loadLanYaMesg-a="loadLanYaMesg"
						@location-a="location"
						@mapsCheckRoter-a="mapsCheckRoter"
						@mapsSetRoutePop-a="mapsSetRoutePop"
						@mapsBindClick-a="mapsBindClick"
						@clickSendMachine-a="clickSendMachine"
						@clickJiQi-a="clickJiQi"
						:pageItem="pageItem"
						:key="index"
						:model="item.children">
					</xhTree>
				</ul>
			</li>
	</div>
</template>

<script>
	export default {
		name:"xhTree",
		props: ["model","pageItem"],
		// created(){console.log(JSON.parse(JSON.stringify(this.model)))},
		methods:{
			clickSendMachine(data){
				this.$emit("clickSendMachine-a",data)
			},
			clickJiQi(data){
				this.$emit("clickJiQi-a",data)
			},
			location(data){
				this.$emit("location-a",data)
			},
			mapsCheckRoter(data){
				this.$emit("mapsCheckRoter-a",data)
			},
			mapsSetRoutePop(data){
				this.$emit("mapsSetRoutePop-a",data)
			},
			mapsBindClick(data){
				this.$emit("mapsBindClick-a",data)
			},
			noticeServicePlayStopVideo(data){
				this.$emit("noticeServicePlayStopVideo-a",data)
			},
			openDialogMessge(data){
				this.$emit("openDialogMessge-a",data)
			},
			loadLanYaMesg(data){
				this.$emit("loadLanYaMesg-a",data)
			},
			switchTree(e){
				let li = $(e.target).parent().find(" > ul > div > li");
				li.length!=0 ? li.is(":visible")?li.hide('fast'):li.show('fast') : "";
			}
		}
	}
</script>
<style scoped>
	.xh_icon{
		width: 16px;
    height: 16px;
	}
</style>
