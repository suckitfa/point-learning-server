"use strict";

var _require = require('../controller/keypoint'),
    getList = _require.getList,
    getDetail = _require.getDetail,
    newKeyPoint = _require.newKeyPoint,
    updateKeyPoint = _require.updateKeyPoint,
    deleteKeyPoint = _require.deleteKeyPoint;

var _require2 = require('../controller/user'),
    login = _require2.login;

var _require3 = require('../model/resModel'),
    SuccessModel = _require3.SuccessModel,
    ErrorModel = _require3.ErrorModel;

var handleKeyPointRouter = function handleKeyPointRouter(req, res) {
  var method = req.method,
      path = req.path;
  var pointid = req.query.pointid;
  var keyPointData = req.body; // 获取阅读记录列表

  if (method === 'GET' && path === '/api/keypoint/list') {
    var result = getList();
    return result.then(function (listData) {
      return new SuccessModel(listData);
    });
  } // 获取详细的


  if (method === 'GET' && path === '/api/keypoint/detail') {
    var _result = getDetail(pointid);

    return _result.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && path === '/api/keypoint/new') {
    var _result2 = newKeyPoint(keyPointData);

    return _result2.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && path === '/api/keypoint/delete') {
    console.log('keyPointData = ', keyPointData);
    var _pointid = keyPointData.pointid;
    console.log('pointid = ', _pointid);

    var _result3 = deleteKeyPoint(_pointid);

    return _result3.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === "POST" && path === '/api/keypoint/update') {
    var _result4 = updateKeyPoint(keyPointData);

    return _result4.then(function (data) {
      return new SuccessModel(data);
    });
  }
};

module.exports = handleKeyPointRouter;