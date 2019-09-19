const ManagerModel = require('./../models/manager.js');

const ManagerControllers = {
	/*提交管理员信息*/
	insert: async function(req, res, next){
		let name = req.body.name;
		let phone = req.body.phone;
		let password = req.body.password;

		try{
			const manager = await ManagerModel.insert({
				name, phone ,password,
			});
			res.json({ 
        code: 200, 
        data: '上传成功'
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '内部错误'
      })
		}
	},
	/*获取管理员所有信息*/
	show: async function(req, res, next){
		try{
			const manager = await ManagerModel.allManager();
			// console.log(manager)
			res.json({ 
        code: 200, 
        data: manager
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '获取失败'
      })
		}
	},

	/*获取管理员个人信息*/
	personal: async function(req, res, next){
		let id = req.params.id;

		try{
			const manager = await ManagerModel.select({id})
			res.json({ 
        code: 200, 
        data: manager
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '获取失败'
      })
		}
	},
	/*修改管理员个人信息*/
	updata:async function(req, res, next){
		let id = req.params.id;
		let name = req.body.name;
		let phone = req.body.phone;
		let password = req.body.password;
		try{
			const manager = await ManagerModel.update(id ,{name,phone,password})
			res.json({ 
        code: 200, 
        data: '修改成功'
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '修改失败'
      })
		}
	},
	/*删除管理员个人信息 软删除*/
	delete:async function(req, res, next){
		let id = req.params.id;
		let isdeleted = 1;
		try{
			const manager = await ManagerModel.update(id,{isdeleted})
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
}
module.exports = ManagerControllers;