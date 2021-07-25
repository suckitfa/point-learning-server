const { exec } = require("../db/mysql");
const TABLE_NAME = 'readlogs';

const getList = () => {
    const sql = `select * from ${TABLE_NAME};`;
    return exec(sql);
}

const getDetail = (logid) => {
    const sql = `select * from ${TABLE_NAME} where 1=1 and logid=${logid}`;
    return exec(sql);

}


const newReadLog = (readlogData) => {
    const { userid, articleid, duration } = readlogData;
    const sql = `insert into ${TABLE_NAME} (userid,articleid,duration) 
    values(${userid},${articleid},${duration});
    `;
    return exec(sql).then(data => {
        if (data.effectedRows > 0) {
            return true;
        }
        return false;
    });
};

// 删除阅读记录
const deleteReadLog = (logid) => {
    const sql = `delete from ${TABLE_NAME} where 1=1 and logid=${logid}`;
    return exec(sql).then(data => {
        if (data.effectedRows > 0) {
            return true;
        }
        return false;
    });
}
module.exports = {
    getList,
    getDetail,
    newReadLog,
    deleteReadLog
}