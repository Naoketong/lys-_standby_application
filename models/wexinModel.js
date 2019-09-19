const configs = require('./../config.js');
const axios = require('axios');
const APPID = configs.miniapp.appid;
const SECRET = configs.miniapp.secret;
const LOGINAPI = function(APPID,SECRET,JSCODE){
  return `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${JSCODE}&grant_type=authorization_code`
}

const weixin = {
  login:function(code){
  	
    let api_url = LOGINAPI(APPID,SECRET,code);
    console.log(api_url)
    return axios.get(api_url)
  }
}

module.exports = weixin;