const {
    getList,
    getDetail,
    newReadLog,
    deleteReadLog
} = require('../controller/readlog');
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleReadLogRouter = (req, res) => {
    const { method, path } = req;
    const logid = req.query.logid;
    const readlogData = req.body;

    // 获取阅读记录列表
    if (method === 'GET' && path === '/api/readlog/list') {
        const result = getList();
        return result.then(listData => {
            return new SuccessModel(listData);
        });
    }

    // 获取详细的
    if (method === 'GET' && path === '/api/readlog/detail') {
        const result = getDetail(logid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && path === '/api/readlog/new') {
        const result = newReadLog(readlogData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && path === '/api/readlog/delete') {
        const { logid } = readlogData;
        const result = deleteReadLog(logid);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

}

module.exports = handleReadLogRouter;