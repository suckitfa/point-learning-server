"use strict";

var _require = require('../db/mysql'),
    exec = _require.exec;

var TABLE_NAME = 'keypoint';

var getList = function getList() {
  // 注意这条语句的处理 
  var sql = "select * from ".concat(TABLE_NAME); // 返回的为promise

  return exec(sql);
};

var getDetail = function getDetail(pointid) {
  var sql = "select * from ".concat(TABLE_NAME, " where 1=1 and pointid=").concat(pointid);
  return exec(sql).then(function (rows) {
    return rows[0];
  });
};

var newKeyPoint = function newKeyPoint(keyPonitData) {
  // 管理员才有权限
  var pointname = keyPonitData.pointname;
  var sql = "insert into ".concat(TABLE_NAME, "(pointname) values('").concat(pointname, "')");
  return exec(sql).then(function (insertData) {
    return {
      id: insertData.insertId
    };
  });
}; // 更新的话就是更新标题和内容


var updateKeyPoint = function updateKeyPoint() {
  var keyPointData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var pointname = keyPointData.pointname,
      pointid = keyPointData.pointid;
  var sql = "update ".concat(TABLE_NAME, " set pointname='").concat(pointname, "' where 1=1 and pointid=").concat(pointid);
  return exec(sql).then(function (updateData) {
    if (updateData.affectedRows > 0) {
      return true;
    }

    return false;
  });
}; // 根据article删除文章


var deleteKeyPoint = function deleteKeyPoint(pointid) {
  var sql = "delete from ".concat(TABLE_NAME, " where 1=1 and pointid=").concat(pointid);
  return exec(sql).then(function (delData) {
    if (delData.affectedRows > 0) {
      return true;
    }

    return false;
  });
};

module.exports = {
  getList: getList,
  getDetail: getDetail,
  newKeyPoint: newKeyPoint,
  updateKeyPoint: updateKeyPoint,
  deleteKeyPoint: deleteKeyPoint
};