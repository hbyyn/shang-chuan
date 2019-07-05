<template>
  <div class="onlineBox">
    在线对比
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      leftRun(){

      },
      toggleSider(){
        var amain = document.getElementById('main');
        var asidebar = amain.getElementsByClassName('sidebar')
        var asidebarRight = amain.getElementsByClassName('sidebarRight')
        if(asidebar[0].offsetLeft == 0){
          var setUp = setInterval(function() {
            if(asidebar[0].offsetLeft> (-240)){
              asidebar[0].style.left = asidebar[0].offsetLeft-10 + 'px'
              asidebarRight[0].style.width = asidebarRight[0].offsetWidth+10+'px';
            }else{
              clearInterval(setUp)
            }
          }, 10)
        }else if(asidebar[0].offsetLeft == -240){
          var setDown = setInterval(function() {
            if(asidebar[0].offsetLeft < 0){
              asidebar[0].style.left = asidebar[0].offsetLeft+10 + 'px'
              asidebarRight[0].style.width = asidebarRight[0].offsetWidth-10+'px';
            }else{
              clearInterval(setDown)
            }
          }, 10)
        }
      }
    },
    mounted() {
      var amain = document.getElementById('main');
      var aonlineBox = amain.getElementsByClassName('onlineBox');
      amain.getElementsByClassName('sidebarRight')[0].style.width = (aonlineBox[0].offsetWidth - '240') + 'px';
      if(document.body.offsetHeight ==document.body.scrollHeight){

      }else{

      }
      window.onresize = function() {
        var amain = document.getElementById('main');
        var aonlineBox = amain.getElementsByClassName('onlineBox');
        amain.getElementsByClassName('sidebarRight')[0].style.width = (aonlineBox[0].offsetWidth - '240') + 'px'
      }
    },
    destroyed(){
      window.onresize = null;
    }
  }
</script>
<style lang="scss">
.onlineBox{
  position: relative;
  .sidebar{
    position: absolute;
    left: 0px;
    width: 240px;
    .tree{
      float: left;
      width: 220px;
    }
    .hinder{
      width: 20px;
      float: left;
      height: 100px;
      background: #f00;
    }
  }
  .sidebarRight{
    // display: inline-block;
    float: right;
  }
}
</style>
