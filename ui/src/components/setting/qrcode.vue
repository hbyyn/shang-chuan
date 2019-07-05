<template>
  <div id="qrCode">
    <img :src="qrCodeUrl" alt width="240" height="240">
  </div>
</template>
<script>
export default {
  data() {
    return {
      qrCodeUrl: ""
    };
  },
  mounted() {
    this.$axios({
      method: "post",
      url: NEW_URL_CONFIG + "/api/qrcode/configdata",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          sessionStorage.getItem("loginPrefix") +
          " " +
          sessionStorage.getItem("loginToken")
      },
      data: {
        configType: "sys_002",
        configId: ""
      }
    }).then(res => {
      if (res.data.statusCode == 200) {
        this.qrCodeUrl = "data:image/jpeg;base64," + res.data.data;
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
  }
};
</script>
<style lang="scss">
#qrCode {
  background-color: #fff;
  border-radius: 4px;
  padding: 30px 20px;
  position: relative;
  height: 260px;
  img {
    position: absolute;
    left: 50%;
    margin-left: -120px;
  }
}
</style>
