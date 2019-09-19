const CourseModel = require('./../models/course.js');

const CourseControllers = {
	/*提交单个课程信息*/
	insert: async function(req, res, next){
		let name = req.body.name;
		let description = req.body.description;
		let teacher = req.body.teacher;
		let teacher_phone = req.body.teacher_phone;
		try{
			const courses = await CourseModel.insert({
				name, description ,teacher,teacher_phone
			});
			res.json({ 
        code: 200, 
        message: '上传成功',
        data: courses
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '内部错误'
      })
		}
	},
	/*获取所有课程信息*/
	show: async function(req, res, next) {
    let name = req.query.name;
    let teacher_phone = req.query.teacher_phone;
    let pageSize = req.query.page_size || 20;
    let currentPage = req.query.current_page || 1;
    let params = {};
    if(name) params.name = name;
    if(teacher_phone) params.teacher_phone = teacher_phone;
    try {
      let users = await CourseModel
        .pagination(pageSize, currentPage, params)
        .orderBy('id', 'desc');
      let courseCount = await CourseModel.count(params);

      let total = courseCount[0].total;
      res.json({code: 200, messsage: '获取成功', data: {
        datas: users,
        pagination: {
          total: total,
          current_page: currentPage,
          page_size: pageSize,
        }

        
      }})
    } catch (err) {
      res.json({code:0,messsage: '服务器错误'});
    }
  },
	/*获取单个课程信息*/
	personal: async function(req, res, next){
		let id = req.params.id;
		try{
			const courses = await CourseModel.select({id})
			res.json({ 
        code: 200, 
        data: courses
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '获取失败'
      })
		}
	},
	/*修改单个课程信息*/
	updata:async function(req, res, next){
		let id = req.params.id;
		let name = req.body.name;
		let description = req.body.description;
		let teacher = req.body.teacher;
		let teacher_phone = req.body.teacher_phone;
		try{
			const courses = await CourseModel
			.update(id ,{name, description ,teacher,teacher_phone})
			res.json({ 
        code: 200, 
        message: '修改成功',
        data:courses
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '修改失败'
      })
		}
	},
	/*删除单个课程信息 软删除*/
  delete:async function(req, res, next){
    let id = req.params.id;
    let isdeleted = 1;
    try{
      const manager = await CourseModel.update(id,{isdeleted})
      res.json({ 
        code: 200, 
        data: '删除成功'
      })
    }catch(err){
      console.log(err)
      res.json({ 
        code: 0,
        message: '删除失败'
      })
    }
  },



  search: async function(req, res, next){
    let name = req.query.name;
    try{
      const courses = await CourseModel.select({name})
      console.log(courses)
      res.json({ 
        code: 200, 
        data: courses
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
module.exports = CourseControllers;