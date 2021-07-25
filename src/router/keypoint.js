const {
    getList,
    getDetail,
    newKeyPoint,
    updateKeyPoint,
    deleteKeyPoint
} = require('../controller/keypoint');

const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleKeyPointRouter = (req, res) => {
    const { method, path } = req;
    const pointid = req.query.pointid;
    const keyPointData = req.body;

    // 获取阅读记录列表
    if (method === 'GET' && path === '/api/keypoint/list') {
        const result = getList();
        return result.then(listData => {
            return new SuccessModel(listData);
        });
    }

    // 获取详细的
    if (method === 'GET' && path === '/api/keypoint/detail') {
        const result = getDetail(pointid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && path === '/api/keypoint/new') {
        const result = newKeyPoint(keyPointData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    if (method === 'POST' && path === '/api/keypoint/delete') {
        console.log('keyPointData = ', keyPointData);
        const { pointid } = keyPointData;
        console.log('pointid = ', pointid);
        const result = deleteKeyPoint(pointid);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    if (method === "POST" && path === '/api/keypoint/update') {
        const result = updateKeyPoint(keyPointData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

}

module.exports = handleKeyPointRouter;