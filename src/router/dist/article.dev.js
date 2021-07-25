"use strict";

var _require = require('../controller/article'),
    getList = _require.getList,
    getDetail = _require.getDetail,
    newArticle = _require.newArticle,
    updateArticle = _require.updateArticle,
    deleteArticle = _require.deleteArticle,
    addArticleCountOnce = _require.addArticleCountOnce,
    publishArticle = _require.publishArticle;

var _require2 = require('../controller/user'),
    login = _require2.login;

var _require3 = require('../model/resModel'),
    SuccessModel = _require3.SuccessModel,
    ErrorModel = _require3.ErrorModel; // 验证登入的中间件


var loginCheck = function loginCheck(req) {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel("尚未登入!"));
  }
};

var handleArticleRouter = function handleArticleRouter(req, res) {
  var method = req.method,
      path = req.path; // 获取博客的id

  var articleid = req.query.articleid; // 获取博客列表

  if (method === 'GET' && path === '/api/article/list') {
    var keyword = req.query.keyword || ''; // 从数据库中调取数据controller

    var result = getList(keyword); // 结果封装为promise了

    return result.then(function (listData) {
      return new SuccessModel(listData);
    });
  } // 获取博客详情页：articleid,


  if (method === 'GET' && path === '/api/article/detail') {
    var _result = getDetail(articleid);

    return _result.then(function (data) {
      return new SuccessModel(data);
    });
  } // 新建一篇博客 


  if (method === 'POST' && path === '/api/article/new') {
    var postData = req.body;
    console.log('article = ', postData);

    var _result2 = newArticle(req.body);

    return _result2.then(function (data) {
      return new SuccessModel(data);
    });
  } // 更新一篇博客


  if (method === 'POST' && path === '/api/article/update') {
    var _result3 = updateArticle(req.body);

    return _result3.then(function (val) {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新失败!");
      }
    });
  } // 删除一篇博客


  if (method === "POST" && path === '/api/article/delete') {
    var _articleid = req.body.articleid;

    var _result4 = deleteArticle(_articleid);

    return _result4.then(function (val) {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("删除博客失败！");
      }
    });
  } // 增加一篇文章的阅读量一次


  if (method === "POST" && path === '/api/article/addonecount') {
    var _articleid2 = req.body.articleid;

    var _result5 = addArticleCountOnce(_articleid2);

    return _result5.then(function (val) {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("增加阅读量失败!");
      }
    });
  }

  if (method === "POST" && path === '/api/article/publish') {
    var _articleid3 = req.body.articleid;

    var _result6 = publishArticle(_articleid3);

    return _result6.then(function (data) {
      if (data) {
        return new SuccessModel("发布成功!");
      }

      return new ErrorModel('发布失败!');
    });
  }
};

module.exports = handleArticleRouter;