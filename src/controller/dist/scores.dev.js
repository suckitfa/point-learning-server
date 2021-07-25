"use strict";

var _require = require("../db/mysql"),
    exec = _require.exec;

var TABLE_NAME = 'scores';

var getList = function getList() {
  var sql = "select * from ".concat(TABLE_NAME, ";");
  return exec(sql);
};

var getDetail = function getDetail(scoreid) {
  var sql = "select * from ".concat(TABLE_NAME, " where 1=1 and scoreid=").concat(scoreid);
  return exec(sql);
};

var newScore = function newScore(scoreData) {
  var userid = scoreData.userid,
      partone = scoreData.partone,
      parttwo = scoreData.parttwo,
      partthree = scoreData.partthree;
  var sql = "insert into ".concat(TABLE_NAME, "(userid,partone,parttwo,partthree)\n    values(").concat(userid, ",").concat(partone, ",").concat(parttwo, ",").concat(partthree, ");\n    ");
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
}; // 删除阅读记录


var deleteScore = function deleteScore(scoreid) {
  var sql = "delete from ".concat(TABLE_NAME, " where 1=1 and scoreid=").concat(scoreid, ";");
  return exec(sql).then(function (data) {
    if (data.effectedRows > 0) {
      return true;
    }

    return false;
  });
};

var updateScore = function updateScore(scoreData) {
  var scoreid = scoreData.scoreid,
      partone = scoreData.partone,
      partthree = scoreData.partthree,
      parttwo = scoreData.parttwo;
  var sql = "update ".concat(TABLE_NAME, " set \n    partone=").concat(partone, ",\n    parttwo=").concat(parttwo, ",\n    partthree=").concat(partthree, " \n    where scoreid=").concat(scoreid, "\n    ");
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
  newScore: newScore,
  deleteScore: deleteScore,
  updateScore: updateScore
};