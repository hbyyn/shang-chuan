<template>
	<div>
		<v-header @changeLanguage-a="changeLanguage"></v-header>
		<div id="main">
			<div class="container">
				<router-view :language="language"></router-view>
			</div>
		</div>
		<v-footer></v-footer>
		<v-password></v-password>
		<v-profile></v-profile>
	</div>
</template>

<script>
	import vHeader from './common/Header.vue'
	import vFooter from './common/Footer.vue'
	import vPassword from './common/Password.vue'
	import vProfile from './common/Profile.vue'
	export default {
		data() {
			return {
				language: ""
			}
		},
		components: {
			vHeader,
			vFooter,
			vPassword,
			vProfile
		},
		methods: {
			changeLanguage(e) {
				this.language = e.value;
				switch (e.value) {
					case 'zh-tw':
						localStorage.setItem("languageType", 'zh-TW')
						break;
					case 'zh-cn':
						localStorage.setItem("languageType", 'zh-CN')
						break;
					case 'en':
						localStorage.setItem("languageType", 'en-US')
						break;
				}
			}
		}
	}
</script>
<style lang='scss'>
	#main {
		padding: 100px 0px 40px;
		>.container {
			min-height: 400px;
		}
	}
</style>
