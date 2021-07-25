const { exec } = require('../db/mysql');
const getList = (keyword) => {
    // 注意这条语句的处理 
    let sql = `select * from articles where 1=1 `;
    if (keyword) {
        sql += ` and keyword like '%${keyword}%' `
    }
    sql += `order by createtime asc;`;
    // 返回的为promise
    return exec(sql);
}

const getDetail = (id) => {
    const sql = `select * from articles where articleid='${id}'`;
    return exec(sql).then(rows => {
        return rows[0];
    });
}

const newArticle = (articleData = {}) => {
    console.log('articleData = ', articleData);
    // 管理员才有权限
    const { title, pointid, userid, status, content, keyword } = articleData;
    const createtime = Date.now();
    const sql = `
    insert into 
    articles(title,userid,keyword,createtime,content,pointid,status) 
    values('${title}',${userid},'${keyword}',${createtime},'${content}',${pointid},${status});`;
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        };
    });
}



// 更新的话就是更新标题和内容
const updateArticle = (articleData = {}) => {
    const { articleid, content } = articleData;

    const createtime = Date.now();
    const sql = `
    update articles 
        set 
         content='${content}',
         createtime=${createtime} 
        where articleid=${articleid};
    `;
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
}


// 根据article删除文章
const deleteArticle = (articleid) => {
    const sql = `delete from articles where articleid=${articleid};`;
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
}

const addArticleCountOnce = (articleid) => {
    return getDetail(articleid).then(data => {
        if (data) {
            let { readcount } = data;
            readcount += 1;
            const sql = `update articles 
            set readcount=${readcount} 
            where 1=1 and articleid=${articleid}
            `;
            return exec(sql).then(updateData => {
                if (updateData.affectedRows > 0) {
                    return true;
                }
                return false;
            });
        } else {
            return false;
        }
    });
}

const publishArticle = (articleid) => {
    const sql = `update articles set status=1 where 1=1 and articleid=${articleid};`;
    return exec(sql).then(data => {
        if (data.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

module.exports = {
    getList,
    getDetail,
    newArticle,
    updateArticle,
    deleteArticle,
    addArticleCountOnce,
    publishArticle
}