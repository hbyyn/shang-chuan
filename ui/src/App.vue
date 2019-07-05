<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
	// 经典蓝
	import './assets/theme/0c64eb/index.css';
	// 叶兰绿
	import './assets/theme/00b791/index.css';
	// 赤诚红
	import './assets/theme/e62340/index.css';
	// 玉烟紫
	import './assets/theme/3123ae/index.css';
	// 芙蕖粉
	import './assets/theme/a050d7/index.css';
	// 露莓黑
	import './assets/theme/23304d/index.css';
	export default {
		name: 'App'
	}
</script>
<style lang="scss">
	@import './assets/theme/common.scss';

	html,
	body {
		margin: 0px;
		padding: 0px;
		height: 100%;
		background-color: #efefef;
	}

	a {
		text-decoration: none
	}

	ul,
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.video-box>embed {
		height: 100% !important;
		width: 100% !important;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		width: 100%;
		height: auto;
	}

	.overflow-hidden {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	#app .el-pager li {
		height: 24px;
		line-height: 24px;
		margin: 2px 5px;
		border-radius: 4px;
		min-width: 24px;
	}

	.clearfix:after {
		content: "";
		height: 0;
		// display:block;
		visibility: hidden;
		clear: both;
	}

	.clearfix {
		zoom: 1;
	}

  .el-input-number__increase,.el-input-number__decrease{
    display: none!important;
  }
  .el-input-number .el-input__inner{
    text-align: left!important;
    padding: 0px 15px!important;
  }
	@media screen and (max-width: 1200px) {
		#app {
			width: 1200px;
		}

		#header {
			width: 1200px;

			.subHeadr .container {
				padding: 0px 20px;
			}

			.container {
				hgroup {
					left: 20px;
				}

				.personal {
					right: 20px;
				}
			}
		}

		#main {
			>.container {
				width: 1160px;
				padding: 20px 20px;
			}
		}

		#footer {
			.footer {
				width: 1160px;
				padding: 20px 20px;
			}
		}
	}

	@media screen and (min-width: 1200px) and (max-width: 1400px) {
		#header {
			.subHeadr .container {
				padding: 0px 20px;
			}

			.container {
				hgroup {
					left: 20px;
				}

				.personal {
					right: 20px;
				}
			}
		}

		#main {
			>.container {
				padding: 20px 20px;
			}
		}

		#footer {
			.footer {
				// width: 1200px;
				padding: 0px 20px;
			}
		}
	}

	@media screen and (min-width: 1400px) and (max-width: 1800px) {
		#header {
			.subHeadr .container {
				padding: 0px 40px;
			}

			.container {
				hgroup {
					left: 40px;
				}

				.personal {
					right: 40px;
				}
			}
		}

		#main {
			>.container {
				padding: 20px 40px;
			}
		}

		#footer {
			.footer {
				// width: 1200px;
				padding: 0px 40px;
			}
		}
	}

	@media screen and (min-width: 1800px) {
		#header {

			.mainHeadr,
			.subHeadr {
				width: 100%;
			}

			.subHeadr .container {
				padding: 0px 40px;
				width: 1720px;
			}

			.container {
				width: 1800px;
				margin: 0 auto;

				hgroup {
					left: 40px;
				}

				.personal {
					right: 40px;
				}
			}
		}

		#main {
			>.container {
				width: 1720px;
				margin: 0 auto;
				padding: 20px 40px;
			}
		}

		#footer {
			.footer {
				width: 1720px;
				padding: 0px 40px;
			}
		}
	}
</style>
