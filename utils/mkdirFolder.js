const fs = require("fs");
const path = require("path");

/**
 * 递归创建文件夹
 * @param {string} dirname
 * @returns 创建结果
 */
const mkdirsSync = function (dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

module.exports = mkdirsSync;
