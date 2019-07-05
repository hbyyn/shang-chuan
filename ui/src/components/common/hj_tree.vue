<template>
  <ul class='hj-tree'>
    <li v-for="(item,i) in powerData" :key='i' :title="i">
      <span @click.stop="toggle" class='item'><i class='iconfont well-4g-icon-bumen' v-if="item.childNodes.length" @click.stop="toggleI"></i>{{item.operationName}}</span>
      <span v-for="(pri,j) in item.privileges" :key='j' class='input_list'>
        <el-checkbox v-model="pri.isUse" @change = "powerChange">{{pri.privilegeName}}</el-checkbox>
      </span>
      <transition name="tree-node">
        <hjTree :powerData='item.childNodes' :increment-conut="count"></hjTree>
      </transition>
    </li>
  </ul>
</template>
<script>
export default {
  name:"hjTree",
  // props: ['powerData'],
  props: {
    powerData: '',
    incrementConut: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  methods: {
    toggle(e){
      let li = $(e.target).parent().find(" > ul > li");
      li.length!=0 ? li.is(":visible")?li.hide('fast'):li.show('fast') : "";
    },
    toggleI(e){
      let li = $(e.target).parent().siblings('ul').find("li");
      li.length!=0 ? li.is(":visible")?li.hide('fast'):li.show('fast') : "";
    },
    powerChange(){

    }
    // relation(data){
    //   let that = this;
    //   if(!data.length){
    //     return false
    //   }
    //   for (let i = 0; i < data.length; i++) {
    //     if(!data[i].privileges[0].isUse){
    //       // console.log(i)
    //       for (let j = 0; j < data[i].privileges.length; j++) {
    //         data[i].privileges[j].isUse = false;
    //       }
    //     }
    //     if(data[i].childNodes.length){
    //       that.relation(data[i].childNodes)
    //     }
    //   }
    // }
  },
  watch:{
    power: {
      handler(newVal,oldVal){
        console.log(JSON.parse(newVal))
        console.log(JSON.parse(oldVal))
        console.log(this.count)
        if(this.count==1){
          let a=[],b=[];
          for (let i = 0; i < JSON.parse(newVal).length; i++) {
            const eleI = JSON.parse(newVal)[i];
            a.push([]);
            for (let j = 0; j < eleI.privileges.length; j++) {
              const eleII = eleI.privileges[j];
              a[i][j] = eleII.isUse;
            }
          }
          for (let i = 0; i < JSON.parse(oldVal).length; i++) {
            const eleI = JSON.parse(oldVal)[i];
            b.push([]);
            for (let j = 0; j < eleI.privileges.length; j++) {
              const eleII = eleI.privileges[j];
              b[i][j] = eleII.isUse;
            }
          }
          // console.log(a)
          // console.log(b)
        } else {

        }
        // for (let i = 0; i < newVal.length; i++) {
        //   const eleI = newVal[i];
        //   if(!eleI.privileges[0].isUse){
        //     for (let j = 0; j < eleI.privileges.length; j++) {
        //       const eleJ = eleI.privileges[j];
        //       eleJ.isUse = false;
        //     }
        //     if(eleI.childNodes.length){
        //       for (let k = 0; k < eleI.childNodes.length; k++) {
        //         const eleK = eleI.childNodes[k];
        //         for (let l = 0; l < eleK.privileges.length; l++) {
        //           const eleL = eleK.privileges[l];
        //           eleL.isUse = false;
        //         }
        //       }
        //     }
        //   } else {

        //   }
        // }
        // for (let i = 0; i < newVal.length; i++) {
        //   const eleI = newVal[i];
        //   if(!eleI.privileges[0].isUse){
        //     for (let j = 0; j < eleI.privileges.length; j++) {
        //       const eleJ = eleI.privileges[j];
        //       eleJ.isUse = false;
        //     }
        //     if(eleI.childNodes.length){
        //       for (let k = 0; k < eleI.childNodes.length; k++) {
        //         const eleK = eleI.childNodes[k];
        //         for (let l = 0; l < eleK.privileges.length; l++) {
        //           const eleL = eleK.privileges[l];
        //           eleL.isUse = false;
        //         }
        //       }
        //     }
        //   } else {

        //   }
        // }
      },
      // immediate: true,
      deep: true
    }
  },
  computed: {
    power(){
      return JSON.stringify(this.powerData)
    },
    count(){
      var c = this.incrementConut
      return ++c
    }
  },
}
</script>
<style lang="scss">
.tree-node-enter-active,.tree-node-leave-active{
  transition: all 2.5s ease;
}
.hj-tree {
  list-style: none;
  li{
    list-style-type: none;
    margin: 0;
    padding: 10px 5px 0 5px;
    position: relative;
    margin: 0px 0px 0px 20px;
    &::before {
      border-left: 1px solid #999;
      bottom: 50px;
      height: 38px;
      top: 0;
      width: 1px;
      content: '';
      left: -5px;
      position: absolute;
      right: auto;
    }
    &::after {
      border-top: 1px solid #999;
      height: 20px;
      top: 25px;
      width: 10px;
      content: '';
      left: -5px;
      position: absolute;
      right: auto;
    }
    span.item{
      border-radius: 5px;
      display: inline-block;
      padding: 3px 8px;
      text-decoration: none;
      font-size: 15px;
      font-weight: bold;
      &:hover{
        cursor: pointer
      }
    }
    span.el-checkbox__label{
      padding-left: 2px;
      padding-right: 15px;
    }
    .input_list{
      label{
        margin-right: 10px;
        cursor: pointer;
      }
      .input_checked{
        display: inline-block;
        position: relative;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        background-color: #fff;
        z-index: 1;
        top: 2px;
      }
      .input_title{
        display: inline-block;
        padding-left: 5px;
        padding-right: 5px;
        line-height: 19px;
        font-size: 14px;
      }
      .is_checked{
        .input_checked{
          background-color: #409eff;
          border-color: #409eff;
          &::after{
            box-sizing: content-box;
            content: "";
            border: 1px solid #fff;
            border-left: 0;
            border-top: 0;
            height: 7px;
            left: 4px;
            position: absolute;
            top: 1px;
            transform: rotate(45deg) scaleY(1);
            width: 3px;
            transition: transform .15s ease-in .05s;
            transform-origin: center;
          }
        }
        .input_title{
          color: #409eff;
        }
      }
    }
  }
}
</style>
