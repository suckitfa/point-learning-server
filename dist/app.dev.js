"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var querystring = require('querystring');

var _require = require('./src/utils/log'),
    access = _require.access;

var handleArticleRouter = require('./src/router/article');

var handleUserRouter = require('./src/router/user');

var handleReadLogRouter = require('./src/router/readlog');

var handleKeyPointRouter = require('./src/router/keypoint');

var handleScoreRouter = require('./src/router/scores');

var _require2 = require('./src/db/redis'),
    get = _require2.get; // SESSION


var SESSION_DATA = {}; // 获取cookie的过期事件

var getCookieExpires = function getCookieExpires() {
  var d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  console.log(d.toGMTString());
  return d.toGMTString();
}; // 用于处理post data


var getPostData = function getPostData(req) {
  var promise = new Promise(function (resolve, reject) {
    var dataType = req.headers['content-type'];

    if (req.method !== 'POST') {
      resolve({});
      return;
    } // 传入数据格式不是json


    if (dataType && dataType.indexOf('application/json') === -1) {
      resolve({});
      return;
    }

    var postData = "";
    req.on('data', function (chunk) {
      postData += chunk.toString();
    });
    req.on('end', function () {
      if (!postData) {
        resolve({});
        return;
      }

      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

var serverHandle = function serverHandle(req, res) {
  // 记录access log
  access("".concat(req.method, " -- ").concat(req.url, " -- ").concat(req.headers['user-agent'], " -- ").concat(Date.now())); // 保证返回的数据为JSON

  res.setHeader('Content-Type', 'application/json'); // 暂时允许跨域

  res.setHeader('Access-Control-Allow-Origin', '*'); // Request methods you wish to allow

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // 获取url,path
  // Request headers you wish to allow

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  var url = req.url;
  req.path = url.split('?')[0]; // 解析query参数

  req.query = querystring.parse(url.split('?')[1]);
  req.cookie = {}; // 解析cookie

  var cookieString = req.headers.cookie || '';
  cookieString.split(';').forEach(function (item) {
    if (!item) {
      return;
    }

    var arr = item.split('=');

    var _arr2 = _slicedToArray(arr, 2),
        key = _arr2[0],
        val = _arr2[1];

    req.cookie[key.trim()] = val.trim();
  }); // 解析session

  var needSetCookie = false;
  var userId = req.cookie.userid;

  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = "".concat(Date.now(), "_").concat(Math.random());
    SESSION_DATA[userId] = {};
  }

  req.session = SESSION_DATA[userId]; // 处理postData之后，在then中处理对应的路由

  getPostData(req).then(function (postData) {
    req.body = postData; // 处理blog路由,并返回对应数据

    var articleResult = handleArticleRouter(req, res);

    if (articleResult) {
      articleResult.then(function (articleData) {
        if (articleData) {
          if (needSetCookie) {
            res.setHeader('Set-Cookie', "userid=".concat(userId, ";path=/; httpOnly; expires=").concat(getCookieExpires()));
          }

          res.end(JSON.stringify(articleData));
        }
      });
      return;
    } // 处理user路由


    var userResult = handleUserRouter(req, res);

    if (userResult) {
      userResult.then(function (userData) {
        if (userData) {
          if (needSetCookie) {
            res.setHeader('Set-Cookie', "userid=".concat(userId, ";path=/; httpOnly; expires=").concat(getCookieExpires()));
          }

          res.end(JSON.stringify(userData));
        }
      });
      return;
    } // 阅读记录


    var logResult = handleReadLogRouter(req, res);

    if (logResult) {
      logResult.then(function (logData) {
        if (logData) {
          if (needSetCookie) {
            res.setHeader('Set-Cookie', "userid=".concat(userId, ";path=/; httpOnly; expires=").concat(getCookieExpires()));
          }

          res.end(JSON.stringify(logData));
        }
      });
      return;
    } // 知识点管理


    var keyPointResult = handleKeyPointRouter(req, res);

    if (keyPointResult) {
      keyPointResult.then(function (keyPointData) {
        if (keyPointData) {
          res.end(JSON.stringify(keyPointData));
        }
      });
      return;
    }

    var scoreResult = handleScoreRouter(req, res);

    if (scoreResult) {
      scoreResult.then(function (scoreData) {
        if (scoreData) {
          console.log('res = ', scoreData);
          res.end(JSON.stringify(scoreData));
        }
      });
      return;
    } // 未命中路由返回404


    res.writeHead(404, {
      "content-type": "text/plain"
    });
    res.write("404 not found\n");
    res.end();
  });
};

module.exports = serverHandle;