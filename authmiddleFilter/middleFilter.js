const ManagerModel = require('./../models/manager.js');
var authCode = require('./../utils/authCode.js');

const authControllers = {
  loginFilter: async function(req,res,next) {
    let token = req.headers.token;
    try{
      token = authCode(token, 'DECODE');
      str = token.split("\t");
      let phone = str[0];
      let password = str[1];
      let id = str[2];
      // console.log(phone ,password ,id)
      if(!phone || !password || !id){
         res.json({ code: 0,   message: '缺少参数' ,data: token});
      return
      }

      let login = await ManagerModel
      .all({phone,password,id})
      .whereNull('isdeleted');
      if(login.length > 0){
        res.locals.manager_id = id
        next()
      }else{
        res.json({ code: 0, message: '没有此用户'});
      }
      res.json({ 
        code: 200, 
        message: '登录成功',
        data: login
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