"use strict";

var _require = require("../db/mysql"),
    exec = _require.exec;

var TABLE_NAME = 'readlogs';

var getList = function getList() {
  var sql = "select * from ".concat(TABLE_NAME, ";");
  return exec(sql);
};

var getDetail = function getDetail(logid) {
  var sql = "select * from ".concat(TABLE_NAME, " where 1=1 and logid=").concat(logid);
  return exec(sql);
};

var newReadLog = function newReadLog(readlogData) {
  var userid = readlogData.userid,
      articleid = readlogData.articleid,
      duration = readlogData.duration;
  var sql = "insert into ".concat(TABLE_NAME, " (userid,articleid,duration) \n    values(").concat(userid, ",").concat(articleid, ",").concat(duration, ");\n    ");
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
}; // 删除阅读记录


var deleteReadLog = function deleteReadLog(logid) {
  var sql = "delete from ".concat(TABLE_NAME, " where 1=1 and logid=").concat(logid);
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
};

module.exports = {
  getList: getList,
  getDetail: getDetail,
  newReadLog: newReadLog,
  deleteReadLog: deleteReadLog
};