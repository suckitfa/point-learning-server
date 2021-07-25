const querystring = require('querystring');
const { access } = require('./src/utils/log');
const handleArticleRouter = require('./src/router/article');
const handleUserRouter = require('./src/router/user');
const handleReadLogRouter = require('./src/router/readlog');
const handleKeyPointRouter = require('./src/router/keypoint');
const handleScoreRouter = require('./src/router/scores');
const { get } = require('./src/db/redis');
// SESSION
const SESSION_DATA = {};
// 获取cookie的过期事件
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    console.log(d.toGMTString());
    return d.toGMTString();
};

// 用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        const dataType = req.headers['content-type'];

        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        // 传入数据格式不是json
        if (dataType && dataType.indexOf('application/json') === -1) {
            resolve({});
            return;
        }

        let postData = "";
        req.on('data', chunk => {
            postData += chunk.toString();
        });
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        });
    });
    return promise;
}


const serverHandle = (req, res) => {
    // 记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);
    // 保证返回的数据为JSON
    res.setHeader('Content-Type', 'application/json');
    // 暂时允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // 获取url,path
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析query参数
    req.query = querystring.parse(url.split('?')[1]);
    req.cookie = {};
    // 解析cookie
    const cookieString = req.headers.cookie || '';
    cookieString.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const [key, val] = arr;
        req.cookie[key.trim()] = val.trim();
    });

    // 解析session
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];


    // 处理postData之后，在then中处理对应的路由
    getPostData(req).then(postData => {
        req.body = postData;

        // 处理blog路由,并返回对应数据
        const articleResult = handleArticleRouter(req, res);
        if (articleResult) {
            articleResult.then(articleData => {
                if (articleData) {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    res.end(JSON.stringify(articleData));
                }
            });
            return;
        }


        // 处理user路由
        const userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                if (userData) {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    res.end(
                        JSON.stringify(userData)
                    );
                }
            });
            return;
        }
        // 阅读记录
        const logResult = handleReadLogRouter(req, res);
        if (logResult) {
            logResult.then(logData => {
                if (logData) {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    res.end(
                        JSON.stringify(logData)
                    );
                }
            });
            return;
        }

        // 知识点管理
        const keyPointResult = handleKeyPointRouter(req, res);
        if (keyPointResult) {
            keyPointResult.then(keyPointData => {
                if (keyPointData) {
                    res.end(JSON.stringify(keyPointData));
                }
            });
            return;
        }

        const scoreResult = handleScoreRouter(req, res);
        if (scoreResult) {
            scoreResult.then(scoreData => {
                if (scoreData) {
                    console.log('res = ', scoreData);
                    res.end(JSON.stringify(scoreData));
                }
            });
            return;
        }
        // 未命中路由返回404
        res.writeHead(404, {
            "content-type": "text/plain"
        });
        res.write("404 not found\n");
        res.end();
    });
}
module.exports = serverHandle;