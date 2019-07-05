<template>
	<div>
		<el-card class="box-card">
			<el-form :inline="true" ref="form" :model="form">
				<el-form-item :label="$t('header.maps.mapTypeSettings')">
					<el-select v-model="form.region">
						<el-option :label="$t('header.maps.gaoDeMap')" value="GaoDe"></el-option>
						<el-option :label="$t('header.maps.googleMap')" value="Google"></el-option>
						<!-- <el-option :label="$t('header.maps.notUsingMaps')" value="Not"></el-option> -->
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">{{$t('header.maps.confirm')}}</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				form: {
					region: 'GaoDe'
				}
			}
		},
		created() {
			// console.log(localStorage.getItem("mapType"))
			switch (localStorage.getItem("mapType")) {
				// case "0":
				// 	this.form.region = "Not"
				// break;
				case "1":
					this.form.region = "GaoDe"
					break;
				case "2":
					this.form.region = "Google"
					break;
			}
		},
		methods: {
			onSubmit() {
				let sign = 0;
				switch (this.form.region) {
					case "GaoDe":
						sign = 1
						break;
					case "Google":
						sign = 2
						break;
				}
				if (localStorage.getItem("mapType") !== sign) {
					// let _script_dom = document.getElementById("mapsApi"),
					// 	_new_script = document.createElement("script"),
					// 	body = document.body;
					// console.log(_script_dom)
					// console.log(body)
					// body.removeChild(_script_dom);
					// _new_script.setAttribute("id", "mapsApi");
					// _new_script.src = sign == 1 ?
					// 	"https://webapi.amap.com/maps?v=1.4.12&key=55c946e54db85b15aa34c9037f8ed115&plugin=AMap.Driving" :
					// 	"https://maps.googleapis.com/maps/api/js?key=AIzaSyDtxkNkKLY-PRQe6gMidyyPAKrRAWgBBhI"
					// body.appendChild(_new_script)
					// localStorage.setItem("mapType", sign)
					// MAP_TYPE = sign
					// let that = this
					// _new_script.onload = _new_script.onreadystatechange = function() {
					// 	console.log(this.readyState)
					// 	if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
					// 		Vue.prototype.load_map_Success = true
					// 		// that.$message.success(that.$t("onLine.serviceError"));
					// 		that.$message.success("加载地图成功");
					// 	}
					// }
					localStorage.setItem("mapType", sign);
					location.reload();
				}
			}
		}
	}
</script>

<style>
</style>
