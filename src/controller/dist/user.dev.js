"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var _require = require("../db/mysql"),
    exec = _require.exec;

var login = function login(studentid, password) {
  var sql = "select userid,username,studentid,isadmin\n     from users where \n    1=1 \n    and password=md5('".concat(password, "')\n    and studentid='").concat(studentid, "';");
  return exec(sql).then(function (rows) {
    return rows[0] || {};
  });
};

var getList = function getList() {
  var sql = "select userid,username,studentid,isadmin,status from users where 1=1;";
  return exec(sql);
};

var getDetail = function getDetail(userid) {
  var sql = "select \n        userid,username,studentid,isadmin,status \n        from users \n        where 1=1 and \n        userid=".concat(userid, "\n        ;");
  return exec(sql);
};

var newUser = function newUser(userData) {
  var username = userData.username,
      studentid = userData.studentid,
      password = userData.password,
      _userData$isadmin = userData.isadmin,
      isadmin = _userData$isadmin === void 0 ? 0 : _userData$isadmin,
      _userData$status = userData.status,
      status = _userData$status === void 0 ? 1 : _userData$status;
  var sql = "insert into users (username,password,studentid,isadmin,status) values('".concat(username, "',md5('").concat(password, "'),'").concat(studentid, "',").concat(isadmin, ",").concat(status, ");");
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
};

var updateUser = function updateUser(userData) {
  var userid = userData.userid,
      username = userData.username,
      studentid = userData.studentid,
      password = userData.password,
      _userData$isadmin2 = userData.isadmin,
      isadmin = _userData$isadmin2 === void 0 ? 0 : _userData$isadmin2,
      _userData$status2 = userData.status,
      status = _userData$status2 === void 0 ? 1 : _userData$status2;
  var sql = "update users set \n    username='".concat(username, "',");

  if (password) {
    sql += (_readOnlyError("sql"), "password=md5('".concat(password, "'),"));
  }

  slq += " studentid ='".concat(studentid, "' where 1=1 and userid=").concat(userid, ";");
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
};

var deleteUser = function deleteUser(userid) {
  var sql = "\n        delete from users where 1 = 1 and userid = $ { userid }\n        ";
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
};

module.exports = {
  login: login,
  getList: getList,
  getDetail: getDetail,
  newUser: newUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};