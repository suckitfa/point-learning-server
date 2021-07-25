const { exec } = require('../db/mysql');
const TABLE_NAME = 'keypoint';

const getList = () => {
    // 注意这条语句的处理 
    const sql = `select * from ${TABLE_NAME}`;
    // 返回的为promise
    return exec(sql);
}

const getDetail = (pointid) => {
    const sql = `select * from ${TABLE_NAME} where 1=1 and pointid=${pointid}`;
    return exec(sql).then(rows => {
        return rows[0];
    });
}

const newKeyPoint = (keyPonitData) => {
    // 管理员才有权限
    const { pointname } = keyPonitData;
    const sql = `insert into ${TABLE_NAME}(pointname) values('${pointname}')`;
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        };
    });
}

// 更新的话就是更新标题和内容
const updateKeyPoint = (keyPointData = {}) => {
    const { pointname, pointid } = keyPointData;
    const sql = `update ${TABLE_NAME} set pointname='${pointname}' where 1=1 and pointid=${pointid}`;
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
}


// 根据article删除文章
const deleteKeyPoint = (pointid) => {
    const sql = `delete from ${TABLE_NAME} where 1=1 and pointid=${pointid}`;
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
}
module.exports = {
    getList,
    getDetail,
    newKeyPoint,
    updateKeyPoint,
    deleteKeyPoint
}