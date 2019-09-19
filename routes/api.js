var express = require('express');
var router = express.Router();

var managerControllers = require('./../controllers/managerControllers.js');
var userControllers = require('./../controllers/userControllers.js');
var paymentControllers = require('./../controllers/paymentControllers.js');
var courseControllers = require('./../controllers/courseControllers.js');
var classControllers = require('./../controllers/classControllers.js');
var lessonController = require('./../controllers/lessonController.js');
var authControllers = require('./../controllers/authControllers.js');
var leaveController = require('./../controllers/leaveController.js');
var miniController = require('./../controllers/miniController.js');



// var authmiddleFilter = require('./../authmiddleFilter/middleFilter.js');

const knex = require('./../models/knex.js');


router.post('/auth/login',authControllers.login);
/*管理员*/
router.post('/manager',/*authmiddleFilter.loginFilter,*/ managerControllers.insert);/*添加管理员*/
router.get('/manager',/*authmiddleFilter.loginFilter,*/  managerControllers.show);/*获取管理员所有信息*/
router.get('/manager/:id',/*authmiddleFilter.loginFilter,*/  managerControllers.personal);/*获取管理员个人信息*/
router.put('/manager/:id',/*authmiddleFilter.loginFilter,*/  managerControllers.updata);/*修改管理员个人信息*/
router.delete('/manager/:id',/*authmiddleFilter.loginFilter,*/ managerControllers.delete);/*删除管理员个人信息 软删除*/

/*客户*/
router.post('/user',/*authmiddleFilter.loginFilter,*/  userControllers.insert);/*添加客户*/
router.get('/user',/*authmiddleFilter.loginFilter,*/  userControllers.show);/*获取客户所有信息*/
router.get('/user/:id',/*authmiddleFilter.loginFilter,*/  userControllers.personal);/*获取客户个人信息*/
router.put('/user/:id',/*authmiddleFilter.loginFilter,*/  userControllers.updata);/*修改客户个人信息*/

/*钱款收入*/
router.post('/payment',/*authmiddleFilter.loginFilter,*/  paymentControllers.insert);/*添加钱款*/
router.get('/payment',/*authmiddleFilter.loginFilter,*/  paymentControllers.show);/*获取钱款所有信息*/
router.get('/payment/alone/',/*authmiddleFilter.loginFilter,*/  paymentControllers.personal);/*获取钱款单独信息*/

// 课程

router.post('/course',/*authmiddleFilter.loginFilter,*/  courseControllers.insert);/*添加课程*/

router.get('/course',/*authmiddleFilter.loginFilter,*/  courseControllers.show);/*获取课程所有信息*/
router.get('/course/alone',/*authmiddleFilter.loginFilter,*/  courseControllers.search);
router.get('/course/:id',/*authmiddleFilter.loginFilter,*/  courseControllers.personal);/*获取课程个人信息*/
router.put('/course/:id',/*authmiddleFilter.loginFilter,*/  courseControllers.updata);/*修改课程个人信息*/
router.delete('/course/:id',/*authmiddleFilter.loginFilter,*/ courseControllers.delete);/*删除课程信息 软删除*/

// 班级
router.post('/class',/*authmiddleFilter.loginFilter,*/  classControllers.insert);/*添加班级*/
router.get('/class',/*authmiddleFilter.loginFilter,*/  classControllers.show);/*获取班级所有信息*/
router.get('/class/:id',/*authmiddleFilter.loginFilter,*/  classControllers.personal);/*获取班级信息*/
router.put('/class/:id',/*authmiddleFilter.loginFilter,*/  classControllers.updata);/*修改班级信息*/
router.post('/class/:id/adduser',/*authmiddleFilter.loginFilter,*/  classControllers.adduser);

// 课
router.put('/lesson/:id',/*authmiddleFilter.loginFilter,*/  lessonController.update);
router.get('/lesson/:id',/*authmiddleFilter.loginFilter,*/  lessonController.personal);
router.post('/lesson/:id/callnow',/*authmiddleFilter.loginFilter,*/  lessonController.callnow);
router.post('/lesson/:id/status', /*authmiddleFilter.loginFilter,*/ lessonController.status);


// 请假
router.get('/leave', /*authmiddleFilter.loginFilter,*/ leaveController.show);
router.put('/leave/:id', /*authmiddleFilter.loginFilter,*/ leaveController.update);

//小程序
router.post('/miniprogram/wxbind', miniController.wxbind);

router.post('/miniprogram/wxlogin', miniController.wxlogin);


router.get('/miniprogram/user/:user_id/class', miniController.class);
router.get('/miniprogram/user/:user_id/class/:class_id', miniController.classItem);
router.post('/miniprogram/user-lesson/:id/leave-apply', miniController.leaveApply);

module.exports = router;
 
