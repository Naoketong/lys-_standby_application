const weixinModel = require('./../models/wexinModel.js');
const authCode = require('./../utils/authCode.js');
const axios = require('axios');
const userModel = require('./../models/user.js');
const userClassModel = require('./../models/userclass.js');
const userLessonModel = require('./../models/userlesson.js');
const leaveModel = require('./../models/leave.js');

var { formatDate, formatMin } = require('./../utils/date.js');



const miniController = {
  wxbind: async function(req,res,next) {
    const code = req.body.code;
    const name = req.body.name;
    const phone = req.body.phone;

    if(!code){
      res.json({ code: 0, mssage: 'code empty!'})
      return
    }

    try{
      let weixinRequest = await weixinModel.login(code);
      let weixinData = weixinRequest.data;
      
      let open_id    = weixinData.openid;
      console.log(open_id,'123')
      let userInfo   = await userModel.show({ name, phone });
      userInfo = userInfo[0] || {};

      if(!userInfo.id){
        res.json({ code: 0, message: '请检查姓名、电话是否正确'});
        return
      }

      if(userInfo.open_id && userInfo.open_id === open_id) {
        res.json({ code: 0, message: '该用户已绑定，请联系管理员进行解绑'});
        return
      }

      await userModel.update(userInfo.id,{ open_id });
      res.json({ 
        ceshi: weixinData,
        code: 200,
       success: '绑定成功' 
     });
    } catch(err) {
      console.log(err)
      res.json({ code: 0, message: '绑定失败' })
    }
  },
  
  // wxbind: async function(req,res,next) {
  //   const code = req.query.code;


  //   if(!code){
  //     res.json({ code: 0, mssage: 'code empty!'})
  //     return
  //   }
  //   try{
  //     let appid = 'wx5651e6a11cf8248b';
  //     // let secret = 'a71b7b378e620d5796f63275d31d7213';
  //     let secret = '2aafd1af8ddeebb557a6f06f9114c11b';
  //     let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  //     // console.log(url)
  //   let arr = axios.get(url).then(res => {
  //     console.log(res.data,'你没多大')
  //   }).catch(err => {
  //     console.log(err)
  //   })
  //     // let userInfo   = await userModel.show({ name, phone });
  //     // userInfo = userInfo[0] || {};
     

  //     // await userModel.update(userInfo.id,{ open_id });
  //     res.json({ code: 200, success: '绑定成功' });
  //   } catch(err) {
  //     console.log(err)
  //     res.json({ code: 0, message: '绑定失败' })
  //   }
  // },
  wxlogin: async function(req, res, next) {
    const code = req.body.code;
    if(!code){
      res.json({ code: 0, mssage: 'code empty!'})
      return
    }

    try{
      let weixinRequest = await weixinModel.login(code);
      let weixinData = weixinRequest.data;
      let open_id    = weixinData.openid;
      let userInfo   = await userModel.show({ open_id });
      userInfo = userInfo[0] || {};

      if(!userInfo.id){
        res.json({ code: 0, message: '用户没有绑定'});
        return
      }
      let str = open_id + '\t' + userInfo.id;
      let token = authCode(str, 'ENCODE');
      res.json({ code: 200, data: { 
        userInfo, 
        token
      }})
    } catch(err) {
      console.log(err)
      res.json({ code: 0, message: '登录失败' })
    }
  },
  class:async function(req,res,next) {
    let user_id = req.params.user_id;

    try{
      let klass = await userClassModel
        .where({ user_id: user_id })
        .leftJoin('class', 'user_class.class_id', 'class.id')
        .column('class.id','class.name', 'class.start_at', 'class.end_at');
        klass.map(data=>{
          data.start_at = formatDate(data.start_at);
          data.end_at = formatDate(data.end_at)
        })
      res.json({
        code:200, 
        data: { classes: klass }
      })
    }catch(e) {
      res.json({ code: 0, message: '信息获取失败' })
    }
  },
  classItem: async function(req,res,next) {
    let user_id = req.params.user_id;
    let class_id = req.params.class_id;

    try{
      let lessons = await userLessonModel.show({ user_id, 'user_lesson.class_id':class_id })
        .leftJoin('lesson', 'user_lesson.lesson_id', 'lesson.id')
        .column('user_lesson.id', 'user_lesson.lesson_id', 'user_lesson.class_id', 'user_lesson.status', 'user_lesson.user_id',
          'lesson.date','lesson.start_time', 'lesson.end_time');
      lessons.forEach(data => {
        data.date = data.date ? formatDate(data.date) : '-';
        data.start_time = data.start_time ? formatMin(data.start_time) : '-';
        data.end_time = data.end_time ? formatMin(data.end_time) : '-';
      })
      res.json({code:200, data: { lessons: lessons }})
    }catch(e) {
      console.log(e)
      res.json({ code: 0, message: '信息获取失败' })
    }
  },
  leaveApply: async function(req,res,next) {
    let id = req.params.id;
    let user_id = req.body.user_id;
    let class_id = req.body.class_id;
    let lesson_id = req.body.lesson_id;
    try{
      let userLessons = await userLessonModel.show({ id });
      if(userLessons[0].status === 1) {
        res.json({code:0, messsage: '该课时以上课无法请假'});
        return
      }
      if(userLessons[0].status === 2) {
        res.json({code:0, messsage: '该课时已请假'});
        return
      }
      await leaveModel.insert({ user_id, class_id, lesson_id });
      await userLessonModel.update(id, { status: 2 });
      res.json({code:200,messsage: 'success'});
    }catch (e) {
      console.log(e)
      res.json({code:0,messsage: '服务器错误'});
    }
  }
}

module.exports = miniController;