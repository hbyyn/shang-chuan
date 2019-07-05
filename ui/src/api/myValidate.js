var myValidate = {
  phone(val){
    var mobile = /^1[3|5|8]\d{9}$/,
      phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(val) || phone.test(val);
  },
  email(val){
    var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/
    return reg.test(val)
  }
}

export default myValidate;
