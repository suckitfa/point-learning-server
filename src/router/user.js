const {
    login,
    getList,
    getDetail,
    newUser,
    updateUser,
    deleteUser
} = require('../controller/user');
// 写入session Data
const {set, get } = require('../db/redis');

const { SuccessModel, ErrorModel } = require('../model/resModel');
const handleUserRouter = (req, res) => {
    const { userid } = req.query;
    const { method, path } = req;
    const userData = req.body;
    // 登入: 第一次登入,匹配账号和密码，写入cookie,
    if (method === 'POST' && path === '/api/user/login') {
        const { studentid, password } = userData;
        const result = login(studentid, password);
        return result.then(data => {
            if (data.studentid) {
                const { userid, username, studentid, isadmin } = data;
                // 将数据存储
                req.session = { userid, username, studentid, isadmin };
                // 同步到 redis
                set(req.session.userid, req.session);
                return new SuccessModel(`登入成功！-- ${isadmin}`);
            }
            return new ErrorModel("登入失败！");
        });
    }

    // 验证是否登入
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.studentid) {
            return Promise.resolve(
                new SuccessModel({ username: req.session.username })
            );
        }
        return Promise.resolve(new ErrorModel("登入失败!"));
    }

    // 获取全部用户
    if (method === 'GET' && req.path === '/api/user/list') {
        const result = getList();
        return result.then(listData => {
            return new SuccessModel(listData);
        });
    }

    // 获取单个用户
    if (method === 'GET' && req.path === '/api/user/detail') {
        const result = getDetail(userid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && req.path === '/api/user/new') {
        const result = newUser(userData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && req.path === '/api/user/update') {
        const result = updateUser(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && req.path === '/api/user/delete') {
        const { userid } = req.body;
        const result = deleteUser(userid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }
}

module.exports = handleUserRouter;