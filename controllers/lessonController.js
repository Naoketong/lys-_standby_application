const LessonModel = require('./../models/lesson.js');
const UserLessonModel = require('./../models/userlesson.js');
const PaymentModel = require('./../models/payment.js')
const UserModel = require('./../models/user.js');
var { formatDate } = require('./../utils/date.js');

const lessonController = {
  update:async function(req, res, next) {
    let id = req.params.id;
    let date = req.body.date;
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;

    if(!date || !start_time || !end_time) {
      res.json({code:0,messsage: '参数缺少'});
      return
    }

    try {
      await LessonModel.update(id, { date, start_time, end_time });
      res.json({code: 200, messsage: '修改成功'})
    } catch (err) {
      res.json({code:0,messsage: '服务器错误'});
    }
  },
  personal: async function(req, res, next) {
    let lesson_id = req.params.id;
    try{
      let lessons = await LessonModel.where({id: lesson_id});
      let lessonFirst = lessons[0];
      // console.log(lessonFirst)
      lessonFirst.date = formatDate(lessonFirst.date);
      // lessonFirst.start_time = formatDate(lessonFirst.start_time);
      // lessonFirst.end_time = formatDate(lessonFirst.end_time);
      let users = await UserLessonModel
      .where({lesson_id})
      .leftJoin('user', 'user_lesson.user_id', 'user.id')
      .column('user.id', 'user.name', 'user_lesson.status', 'user_lesson.finish_at');
      users.map(data=>{
        data.finish_at = formatDate(data.finish_at)
      })
      res.json({
        code: 200, 
        messsage: '获取成功',
        data:{
          lesson: lessonFirst,
          users: users,
        }
      })
    }catch (err) {
      console.log(err)
      res.json({
        code:0,
        messsage: '服务器错误'
      });
    }
  },

  callnow: async function(req,res,next) {
    let lesson_id = req.params.id;
    let user_id = req.body.user_id;

    if(!user_id) {
      res.json({code:0,messsage: '缺少用户参数'});
      return
    }

    try {
      let userLessons = await UserLessonModel.where({ lesson_id, user_id });
      let userLesson = userLessons[0];
      if(!userLesson) {
        res.json({code:0,messsage: '该用户没有报班，没有该课程'});
        return
      }
      if(userLesson.status === 2) {
        res.json({code:0,messsage: '该用户已上课'});
        return
      }

      let lessons = await LessonModel.where({id: lesson_id})
      let lessonInfo = lessons[0];
      let total = - lessonInfo.price;
      await UserLessonModel.update(userLesson.id, { status: 2, finish_at: new Date()});
      await PaymentModel.insert({ 
          user_id: user_id, 
          status: 2, 
          total:  total, 
          remark:  '用户上课 lesson_id:' + lesson_id
        })
      await UserModel
        .where({ id: user_id })
        .increment({ balance: total })
      res.json({code: 200, messsage: '点名成功'})
    } catch (err) {
      res.json({code:0,messsage: '服务器错误'});
    }
  },
  status: async function(req,res,next) {
    let id = req.params.id;
    let status = req.body.status;
    // console.log(status)
    if(!status) {
      res.json({code:0,messsage: '参数缺少'});
      return
    }

    try {
      await LessonModel.update(id, { status });
      res.json({code: 200, messsage: '修改成功'})
    } catch (err) {
      console.log(err)
      res.json({code:0,messsage: '服务器错误'});
    }
  },
} 

module.exports = lessonController;