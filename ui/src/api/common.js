let common = {
  time(){
    var d = new Date();
    var year = d.getFullYear();
    var mouth = (d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1);
    var day = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate();
    var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    var curTime = year + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes + ':' + second;
    return curTime
  },
  alcoholBg(a,b,c){
    let bgColor = "";
    let tips = ""
    if(a){
      a = parseFloat(a);
    }
    for (let i = 0; i < b.length; i++) {
      const ele = b[i];
      if (a < ele[0] || a == "0") {
        bgColor = "green";
        tips = 0;
      } else if (a>=ele) {
        bgColor = c[i]
        tips = (i+1);
      }
    }
    return {
      "bg": bgColor,
      "tip": tips
    }
  },
  faceBg(a, b) {
    let bgColor = "";
    let tips = ""
    if (a) {
      a = parseFloat(a);
    }
    if (b > a || a == '0') {
      bgColor = "red";
      tips = '1';
    } else {
      bgColor = "green";
      tips = '2';
    }
    return {
      "bg": bgColor,
      "tip": tips
    }
  }
}
export default common
