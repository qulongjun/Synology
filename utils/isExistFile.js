const fs = require("fs");
const path = require("path");

/**
 * 
 * @param {string} fPath 
 * @param {string} fileName 
 * @param {boolean} isLike 
 * @param {boolean} isRecurrence 
 * @returns 
 */
const isExistFile = function (fPath, fileName, isLike, isRecurrence) {
  // 读文件系统
  let files = fs.readdirSync(fPath);
  let result = false;
  // 遍历每一个文件
  files.forEach(function (item, index) {
    if (result) return;
    // 拼接文件地址
    let filePath = path.join(fPath, item);
    // 获取文件状态
    let stat = fs.statSync(filePath);

    if (isRecurrence && stat.isDirectory() === true) {
      result = isExistFile(filePath, fileName, isLike, isRecurrence);
    }
    if (stat.isFile()) {
      result = isLike ? item.indexOf(fileName) !== -1 : item === fileName;
    }
  });
  return result;
};

module.exports = isExistFile;