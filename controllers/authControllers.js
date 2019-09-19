const ManagerModel = require('./../models/manager.js');
var authCode = require('./../utils/authCode.js');

const authControllers = {
  login: async function(req,res,next) {
    let phone = req.body.phone;
    let password = req.body.password;

    if(!phone || !password){
      res.json({ code: 0,   message: '缺少参数'});
      return
    }
    try{
      let logins = await ManagerModel.select({phone,password});
      let login = logins[0]
      let token = phone + '\t' + password + '\t' + login.id;
      token = authCode(token, 'ENCODE');
      res.json({ 
        code: 200, 
        message: '登录成功',
        data:{
          phone: phone,
          password: password,
          id: login.id,
          token: token
        }
      })
    }catch(err){
      console.log(err)
      res.json({ 
        code: 0,
        message: '内部错误'
      })
    }
  },

  

}
module.exports = authControllers;