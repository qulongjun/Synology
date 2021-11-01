const fs = require("fs");
const request = require("request");

/**
 * 从远端 url 下载文件到本地
 * @param {string} fileUrl 下载地址
 * @param {string} fPath 下载文件路径
 * @param {string} fileName 下载文件名称
 */
const download = function (fileUrl, fPath, fileName) {
  request.head(fileUrl, function (err, res, body) {
    request(fileUrl).pipe(fs.createWriteStream(fPath + "/" + fileName));
  });
};

module.exports = download;
