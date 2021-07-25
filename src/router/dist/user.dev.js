"use strict";

var _require = require('../controller/user'),
    login = _require.login,
    getList = _require.getList,
    getDetail = _require.getDetail,
    newUser = _require.newUser,
    updateUser = _require.updateUser,
    deleteUser = _require.deleteUser; // 写入session Data


var _require2 = require('../db/redis'),
    set = _require2.set,
    get = _require2.get;

var _require3 = require('../model/resModel'),
    SuccessModel = _require3.SuccessModel,
    ErrorModel = _require3.ErrorModel;

var handleUserRouter = function handleUserRouter(req, res) {
  var userid = req.query.userid;
  var method = req.method,
      path = req.path;
  var userData = req.body; // 登入: 第一次登入,匹配账号和密码，写入cookie,

  if (method === 'POST' && path === '/api/user/login') {
    var studentid = userData.studentid,
        password = userData.password;
    var result = login(studentid, password);
    return result.then(function (data) {
      if (data.studentid) {
        var _userid = data.userid,
            username = data.username,
            _studentid = data.studentid,
            isadmin = data.isadmin; // 将数据存储

        req.session = {
          userid: _userid,
          username: username,
          studentid: _studentid,
          isadmin: isadmin
        }; // 同步到 redis

        set(req.session.userid, req.session);
        return new SuccessModel("\u767B\u5165\u6210\u529F\uFF01-- ".concat(isadmin));
      }

      return new ErrorModel("登入失败！");
    });
  } // 验证是否登入


  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.studentid) {
      return Promise.resolve(new SuccessModel({
        username: req.session.username
      }));
    }

    return Promise.resolve(new ErrorModel("登入失败!"));
  } // 获取全部用户


  if (method === 'GET' && req.path === '/api/user/list') {
    var _result = getList();

    return _result.then(function (listData) {
      return new SuccessModel(listData);
    });
  } // 获取单个用户


  if (method === 'GET' && req.path === '/api/user/detail') {
    var _result2 = getDetail(userid);

    return _result2.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && req.path === '/api/user/new') {
    var _result3 = newUser(userData);

    return _result3.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && req.path === '/api/user/update') {
    var _result4 = updateUser(req.body);

    return _result4.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && req.path === '/api/user/delete') {
    var _userid2 = req.body.userid;

    var _result5 = deleteUser(_userid2);

    return _result5.then(function (data) {
      return new SuccessModel(data);
    });
  }
};

module.exports = handleUserRouter;