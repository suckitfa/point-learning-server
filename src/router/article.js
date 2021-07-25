const {
    getList,
    getDetail,
    newArticle,
    updateArticle,
    deleteArticle,
    addArticleCountOnce,
    publishArticle
} = require('../controller/article');
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
// 验证登入的中间件
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel("尚未登入!"));
    }
}

const handleArticleRouter = (req, res) => {
    const { method, path } = req;

    // 获取博客的id
    const articleid = req.query.articleid;

    // 获取博客列表
    if (method === 'GET' && path === '/api/article/list') {
        const keyword = req.query.keyword || '';
        // 从数据库中调取数据controller
        const result = getList(keyword);
        // 结果封装为promise了
        return result.then(listData => {
            return new SuccessModel(listData);
        });
    }

    // 获取博客详情页：articleid,
    if (method === 'GET' && path === '/api/article/detail') {
        const result = getDetail(articleid);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }

    // 新建一篇博客 
    if (method === 'POST' && path === '/api/article/new') {
        const postData = req.body;
        console.log('article = ', postData);
        const result = newArticle(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        });
    }


    // 更新一篇博客
    if (method === 'POST' && path === '/api/article/update') {
        const result = updateArticle(req.body);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel("更新失败!");
            }
        });
    }

    // 删除一篇博客
    if (method === "POST" && path === '/api/article/delete') {
        const { articleid } = req.body;
        const result = deleteArticle(articleid);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel("删除博客失败！");
            }
        });
    }

    // 增加一篇文章的阅读量一次
    if (method === "POST" && path === '/api/article/addonecount') {
        const { articleid } = req.body;
        const result = addArticleCountOnce(articleid);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            } else {
                return new ErrorModel("增加阅读量失败!");
            }
        });
    }

    if (method === "POST" && path === '/api/article/publish') {
        const { articleid } = req.body;
        const result = publishArticle(articleid);
        return result.then(data => {
            if (data) {
                return new SuccessModel("发布成功!");
            }
            return new ErrorModel('发布失败!');
        });
    }
}

module.exports = handleArticleRouter;