"use strict";

var _require = require('../db/mysql'),
    exec = _require.exec;

var getList = function getList(keyword) {
  // 注意这条语句的处理 
  var sql = "select * from articles where 1=1 ";

  if (keyword) {
    sql += " and keyword like '%".concat(keyword, "%' ");
  }

  sql += "order by createtime asc;"; // 返回的为promise

  return exec(sql);
};

var getDetail = function getDetail(id) {
  var sql = "select * from articles where articleid='".concat(id, "'");
  return exec(sql).then(function (rows) {
    return rows[0];
  });
};

var newArticle = function newArticle() {
  var articleData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  console.log('articleData = ', articleData); // 管理员才有权限

  var title = articleData.title,
      pointid = articleData.pointid,
      userid = articleData.userid,
      status = articleData.status,
      content = articleData.content,
      keyword = articleData.keyword;
  var createtime = Date.now();
  var sql = "\n    insert into \n    articles(title,userid,keyword,createtime,content,pointid,status) \n    values('".concat(title, "',").concat(userid, ",'").concat(keyword, "',").concat(createtime, ",'").concat(content, "',").concat(pointid, ",").concat(status, ");");
  return exec(sql).then(function (insertData) {
    return {
      id: insertData.insertId
    };
  });
}; // 更新的话就是更新标题和内容


var updateArticle = function updateArticle() {
  var articleData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var articleid = articleData.articleid,
      content = articleData.content;
  var createtime = Date.now();
  var sql = "\n    update articles \n        set \n         content='".concat(content, "',\n         createtime=").concat(createtime, " \n        where articleid=").concat(articleid, ";\n    ");
  return exec(sql).then(function (updateData) {
    if (updateData.affectedRows > 0) {
      return true;
    }

    return false;
  });
}; // 根据article删除文章


var deleteArticle = function deleteArticle(articleid) {
  var sql = "delete from articles where articleid=".concat(articleid, ";");
  return exec(sql).then(function (delData) {
    if (delData.affectedRows > 0) {
      return true;
    }

    return false;
  });
};

var addArticleCountOnce = function addArticleCountOnce(articleid) {
  return getDetail(articleid).then(function (data) {
    if (data) {
      var readcount = data.readcount;
      readcount += 1;
      var sql = "update articles \n            set readcount=".concat(readcount, " \n            where 1=1 and articleid=").concat(articleid, "\n            ");
      return exec(sql).then(function (updateData) {
        if (updateData.affectedRows > 0) {
          return true;
        }

        return false;
      });
    } else {
      return false;
    }
  });
};

var publishArticle = function publishArticle(articleid) {
  var sql = "update articles set status=1 where 1=1 and articleid=".concat(articleid, ";");
  return exec(sql).then(function (data) {
    if (data.affectedRows > 0) {
      return true;
    }

    return false;
  });
};

module.exports = {
  getList: getList,
  getDetail: getDetail,
  newArticle: newArticle,
  updateArticle: updateArticle,
  deleteArticle: deleteArticle,
  addArticleCountOnce: addArticleCountOnce,
  publishArticle: publishArticle
};