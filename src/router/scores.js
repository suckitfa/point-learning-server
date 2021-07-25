const {
    getList,
    getDetail,
    newScore,
    deleteScore,
    updateScore
} = require('../controller/scores');

const { SuccessModel, ErrorModel } = require('../model/resModel');
const handleScoreRouter = (req, res) => {
    const { scoreid } = req.query;
    const { method, path } = req;
    const scoreData = req.body;

    // 获取分数记录
    if (method === 'GET' && req.path === '/api/scores/list') {
        const result = getList();
        return result.then(listData => {
            return new SuccessModel(listData);
        });
    }

    // 获取单条分数记录
    if (method === 'GET' && req.path === '/api/scores/detail') {
        const result = getDetail(scoreid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    // 新建分数记录
    if (method === 'POST' && req.path === '/api/scores/new') {
        const result = newScore(scoreData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }
    // 删除分数记录
    if (method === 'POST' && req.path === '/api/scores/delete') {
        const { scoreid } = scoreData;
        const result = deleteScore(scoreid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }
    if (method === 'POST' && req.path === '/api/scores/update') {
        const result = updateScore(scoreData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }
}

module.exports = handleScoreRouter;