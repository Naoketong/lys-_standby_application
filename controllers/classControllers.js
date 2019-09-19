const ClassModel = require('./../models/class.js');
const LessonModel = require('./../models/lesson.js');
const UserClassModel = require('./../models/userclass.js');
const UserLessonModel = require('./../models/userlesson.js');

var { formatDate } = require('./../utils/date.js');

const ClassControllers = {
	/*提交单个班级信息*/
	insert: async function(req, res, next){
		let name = req.body.name;
		let description = req.body.description || '';
		let course_id = req.body.course_id;
		let price = req.body.price;
		let lesson_count = req.body.lesson_count;
		let start_at = req.body.start_at;
		let end_at = req.body.end_at;
    let status = req.body.status;

		if(!name || !course_id || isNaN(price) || isNaN(lesson_count) || !start_at || !end_at) {
			res.json({code:0,messsage: '参数缺少'});
			return
		}
		try{
			const classes = await ClassModel.insert({
				name, course_id, description, price, lesson_count, start_at, end_at, status
			});
			let class_id = classes[0];
			let lessomPrice = price/lesson_count;
			let lessons = new Array(lesson_count).fill({ class_id, price: lessomPrice})
			await LessonModel.insert(lessons)
			res.json({ 
        code: 200, 
        message: '上传成功',
        data: class_id
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '内部错误'
      })
		}
	},
	/*获取所有班级信息*/
	show: async function(req, res, next) {
    let name = req.query.name;
    let status = req.query.status;
    let course_id = req.query.course_id;
    let pageSize = req.query.page_size || 20;
    let currentPage = req.query.current_page || 1;
    let startAt = req.query.start_at;
    let endAt = req.query.end_at;
    let params = {};
    let filterColumn = (startAt && endAt) ? 'class.end_at' : '';
    if(status) params['class.status'] = status;
    if(name) params['class.name'] = name;
    if(course_id) params.course_id = course_id;
    try {
      let classes = await ClassModel
        .pagination(pageSize, currentPage, params, {
        	column: filterColumn,
        	startAt: startAt,
        	endAt: endAt
        })
        .leftJoin('course', 'class.course_id', 'course.id')
        .column('class.id', 'class.name', 'class.course_id', 'class.price', 'class.status',
          'class.start_at', 'class.end_at',
          { course_name: 'course.name' })
        .orderBy('id', 'desc');
        classes.forEach(data => {
        	data.start_at = formatDate(data.start_at)
        	data.end_at = formatDate(data.end_at)
        })
      let classesCount = await ClassModel.count(params, {
      	column: filterColumn,
        startAt: startAt,
        endAt: endAt
      });

      let total = classesCount[0].total;
      res.json({code: 200, messsage: '获取成功', data: {
        datas: classes,
        pagination: {
          total: total,
          current_page: currentPage,
          page_size: pageSize,
        }
      }})
    } catch (err) {
    	console.log(err)
      res.json({code:0,messsage: '服务器错误'});
    }
  },
  /*修改单个班级信息*/
  updata:async function(req, res, next) {
    let id = req.params.id;
    let name = req.body.name;
    let description = req.body.description || '';
    let course_id = req.body.course_id;
    let start_at = req.body.start_at;
    let end_at = req.body.end_at;
    let status = req.body.status;

    if(!name || !course_id || !start_at || !end_at) {
      res.json({code:0,messsage: '参数缺少'});
      return
    }

    try {
      await ClassModel.update(id, { name, description, course_id, status, start_at, end_at });
      res.json({code: 200, messsage: '修改成功'})
    } catch (err) {
      console.log(err)
      res.json({code:0,messsage: '服务器错误'});
    }
  },
	// /*获取单个班级信息*/
  personal: async function(req, res, next) {
    let id = req.params.id;
    try {
      let classes = await ClassModel.show({ 'class.id': id})
        .leftJoin('course', 'class.course_id', 'course.id')
        .column('class.id', 'class.name', 'class.course_id', 'class.price', 'class.status', 
          'class.start_at', 'class.end_at',
          { course_name: 'course.name' });
      let klass = classes[0];
      klass.start_at = formatDate(klass.start_at)
      klass.end_at = formatDate(klass.end_at)

      let class_id = klass.id;
      let lessons = await LessonModel.show({ class_id })
      lessons.forEach(data => {
        data.date = data.date ? formatDate(data.date) : '-';
        // data.start_time = formatDate(data.start_time);
        // data.end_time = formatDate(data.end_time)
      })


      let users = await UserClassModel
        .where({ class_id: id })
        .leftJoin('user', 'user_class.user_id', 'user.id')
        .column('user.id','user.name', 'user.phone', 'user_class.created_at');      
      users.map(data=>{
        console.log(data)
        data.created_at = formatDate(data.created_at)
      })
      res.json({code: 200, messsage: '获取成功', data: {
        // ceshi: lessons,
        users: [users],
        class: [klass],
        lessons: [lessons]
      }})
    } catch (err) {
      console.log(err)
      res.json({code:0,messsage: '服务器错误'});
    }
  },
  adduser: async function(req, res, next){
    let class_id = req.params.id;
    let user_id = req.body.user_id;

    try{
      let lessons = await LessonModel.where({ class_id });

      let userLessons = lessons.map( data => {
        return{
          lesson_id: data.id,
          class_id: class_id,
          user_id: user_id,
        }
      })

      let userCLass = await UserClassModel.where({ user_id,class_id });
      
      let hasAddClass = userCLass.length > 0;
      if(hasAddClass) {
        res.json({ code: 0, message: '用户已经加入了该班级'})
        return
      }
      await UserClassModel.insert({user_id, class_id});
      await UserLessonModel.insert(userLessons)
      res.json({ 
        ceshi:userCLass,
         code: 200, 
         data: '加入成功'
       })
    }catch(err){
      console.log(err)
       res.json({ 
         code: 0,
         message: '获取失败'
       })
    }
  },
  

}
module.exports = ClassControllers;