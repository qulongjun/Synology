const fs = require("fs");

/**
 * 递归删除指定文件夹
 * @param {string} fPath 待删除文件夹目录 
 */
const deleteFolder = function (fPath) {
  let files = [];
  // 判断给定的路径是否存在
  if (fs.existsSync(fPath)) {
    // 返回文件和子目录的数组
    files = fs.readdirSync(fPath);
    files.forEach(function (file, index) {
      var curPath = path.join(fPath, file);
      // fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    // 清除文件夹
    fs.rmdirSync(fPath);
  } else {
    console.log("给定的路径不存在，请给出正确的路径");
  }
};

module.exports = deleteFolder;
