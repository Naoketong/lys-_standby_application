const PaymentModel = require('./../models/payment.js');
const UserModel = require('./../models/user.js');
var { formatTime } = require('./../utils/date.js');

const  PaymentControllers = {
	/*添加钱款*/
	insert: async function(req, res, next){
		let status = req.body.status;
		let user_id = req.body.user_id;
		let total = req.body.total;
		let remark = req.body.remark || '';
		if(!status || !user_id || isNaN(total)){
			res.json({ code: 0,message: '参数缺少'});
			return 
		}
		try{
			const payment = await PaymentModel.insert({
				status, user_id, total, remark
			});
			await UserModel.knex().where({id: user_id})
			.increment({balance:total})
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
	personal: async function(req, res, next){
		let name = req.query.name;
		let phone = req.query.phone;
		let arr = {name, phone}
		try{
			const payment = await PaymentModel
			.where({name})
			.leftJoin('user', 'payment.user_id', 'user.id')
      .column('payment.id', 'payment.total', 'payment.user_id', 'payment.created_at','payment.remark','payment.status', 'user.name','user.phone')
			res.json({ 
        code: 200, 
        data: payment
      })
		}catch(err){
			console.log(err)
      res.json({ 
        code: 0,
        message: '获取失败'
      })
		}
	},
	/*获取钱款所有信息*/
	show: async function(req, res, next ) {
    let status = req.query.status;
    let pageSize = req.query.page_size || 20;
    let currentPage = req.query.current_page || 1;
    let startAt = req.query.start_at;
    let endAt = req.query.end_at;
    let filterColumn = (startAt && endAt) ? 'payment.created_at' : '';
    let params = {};
    if(status) params.status = status;
    try {
      let payments = await PaymentModel
        .pagination(pageSize, currentPage, params, {
          column: filterColumn,
          startAt: startAt,
          endAt: endAt,
        })
        .leftJoin('user', 'payment.user_id', 'user.id')
        .column('payment.id', 'payment.total', 'payment.user_id', 'payment.created_at','payment.remark','payment.status', 'user.name')
        .orderBy('id', 'desc');
      payments.forEach(data => data.created_at = formatTime(data.created_at));
      let paymentsCount = await PaymentModel.count(params,  {
        column: filterColumn,
        startAt: startAt,
        endAt: endAt,
      });
      let total = paymentsCount[0].total;
      res.json({code: 200, messsage: '获取成功', data: {
        datas: payments,
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
  }

}
module.exports =  PaymentControllers;