"use strict";

var _require = require('../controller/readlog'),
    getList = _require.getList,
    getDetail = _require.getDetail,
    newReadLog = _require.newReadLog,
    deleteReadLog = _require.deleteReadLog;

var _require2 = require('../controller/user'),
    login = _require2.login;

var _require3 = require('../model/resModel'),
    SuccessModel = _require3.SuccessModel,
    ErrorModel = _require3.ErrorModel;

var handleReadLogRouter = function handleReadLogRouter(req, res) {
  var method = req.method,
      path = req.path;
  var logid = req.query.logid;
  var readlogData = req.body; // 获取阅读记录列表

  if (method === 'GET' && path === '/api/readlog/list') {
    var result = getList();
    return result.then(function (listData) {
      return new SuccessModel(listData);
    });
  } // 获取详细的


  if (method === 'GET' && path === '/api/readlog/detail') {
    var _result = getDetail(logid);

    return _result.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && path === '/api/readlog/new') {
    var _result2 = newReadLog(readlogData);

    return _result2.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && path === '/api/readlog/delete') {
    var _logid = readlogData.logid;

    var _result3 = deleteReadLog(_logid);

    return _result3.then(function (data) {
      return new SuccessModel(data);
    });
  }
};

module.exports = handleReadLogRouter;