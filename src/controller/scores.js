const { exec } = require("../db/mysql");
const TABLE_NAME = 'scores';

const getList = () => {
    const sql = `select * from ${TABLE_NAME};`;
    return exec(sql);
}

const getDetail = (scoreid) => {
    const sql = `select * from ${TABLE_NAME} where 1=1 and scoreid=${scoreid}`;
    return exec(sql);

}


const newScore = (scoreData) => {
    const { userid, partone, parttwo, partthree } = scoreData;
    const sql = `insert into ${TABLE_NAME}(userid,partone,parttwo,partthree)
    values(${userid},${partone},${parttwo},${partthree});
    `;
    return exec(sql).then(data => {
        if (data.effectedRows > 0) {
            return true;
        }
        return false;
    });
};

// 删除阅读记录
const deleteScore = (scoreid) => {
    const sql = `delete from ${TABLE_NAME} where 1=1 and scoreid=${scoreid};`;
    return exec(sql).then(data => {
        if (data.effectedRows > 0) {
            return true;
        }
        return false;
    });
}
const updateScore = (scoreData) => {
    const { scoreid, partone, partthree, parttwo } = scoreData;
    const sql = `update ${TABLE_NAME} set 
    partone=${partone},
    parttwo=${parttwo},
    partthree=${partthree} 
    where scoreid=${scoreid}
    `;
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
    newScore,
    deleteScore,
    updateScore
}