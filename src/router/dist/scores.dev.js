"use strict";

var _require = require('../controller/scores'),
    getList = _require.getList,
    getDetail = _require.getDetail,
    newScore = _require.newScore,
    deleteScore = _require.deleteScore,
    updateScore = _require.updateScore;

var _require2 = require('../model/resModel'),
    SuccessModel = _require2.SuccessModel,
    ErrorModel = _require2.ErrorModel;

var handleScoreRouter = function handleScoreRouter(req, res) {
  var scoreid = req.query.scoreid;
  var method = req.method,
      path = req.path;
  var scoreData = req.body; // 获取分数记录

  if (method === 'GET' && req.path === '/api/scores/list') {
    var result = getList();
    return result.then(function (listData) {
      return new SuccessModel(listData);
    });
  } // 获取单条分数记录


  if (method === 'GET' && req.path === '/api/scores/detail') {
    var _result = getDetail(scoreid);

    return _result.then(function (data) {
      return new SuccessModel(data);
    });
  } // 新建分数记录


  if (method === 'POST' && req.path === '/api/scores/new') {
    var _result2 = newScore(scoreData);

    return _result2.then(function (data) {
      return new SuccessModel(data);
    });
  } // 删除分数记录


  if (method === 'POST' && req.path === '/api/scores/delete') {
    var _scoreid = scoreData.scoreid;

    var _result3 = deleteScore(_scoreid);

    return _result3.then(function (data) {
      return new SuccessModel(data);
    });
  }

  if (method === 'POST' && req.path === '/api/scores/update') {
    var _result4 = updateScore(scoreData);

    return _result4.then(function (data) {
      return new SuccessModel(data);
    });
  }
};

module.exports = handleScoreRouter;