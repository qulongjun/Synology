const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const deleteFolder = require("./deleteFolder");
const mkdirsSync = require('./mkdirFolder');
const download = require("./download");
const config = require("../config");

// 获取文件后缀正则
const lastRegx = /[^\.]\w*$/;

/**
 * 根据文件名称获取番号后，拼接 library url 地址
 * @param {string} fileName 文件名称
 * @returns
 */
const getLibraryUrl = function (fileName) {
  // 正则匹配番号
  const substr = fileName.match(/[a-zA-Z]{3,5}-?[0-9]{1,4}/);

  if (Array.isArray(substr) && substr[0]) {
    let id = substr[0];
    if (id.indexOf("-") === -1) {
      const numRegx = /[0-9]+/;
      const num = id.match(numRegx);
      id = id.replace(num, "-" + num);
    }
    return `${config.LIBRARY_URL}${id.toLowerCase()}`;
  } else {
    console.log(`${fileName} 未能成功获取番号`);
  }
};

const buildFile = function (fileName, fPath, toPath) {
  if (!fs.existsSync(toPath)) {
    // 创建目标文件夹
    mkdirsSync(toPath);
  }
  // 获取 Library 的 URL
  const url = getLibraryUrl(fileName);
  console.log(`开始拉取页面:${fileName}`);
  // 发请求
  request(url, (err, res) => {
    if (err) {
      console.log(`拉取番号${fileName}的页面失败：${err.code}`);
    } else {
      // 解析 DOM
      let $ = cheerio.load(res.body);
      // 获取视频标题
      const title = $($("h3")[0]).text();
      // 获取视频信息
      const info = $($(".info p")[1]).text();
      // 年份正则
      const YEAR_REGX = /(\d{4})-(\d{1,2})-(\d{1,2})/;
      const year = info.match(YEAR_REGX)[1];
      // 获取标准化 ID 番号
      const clearId = title.split(" ")[0];
      // 拼接写入时的真实文件名
      const realTitle = title.replace(clearId, "").replace(" ", "");
      // 拼接写入时的真实路径
      const newPath = `${clearId}_${realTitle}(${year})`;
      // 拼接写入时的真实标题
      const newTitle = `${newPath}.${fileName.match(lastRegx)[0]}`;

      if (newTitle) {
        // 校验是否已经存在该文件
        const isExist = fs.existsSync(`${toPath}/${newPath}`);
        // 如果已经存在了，则不再写入，否则直接写入
        if (isExist) {
          const readDir = fs.readdirSync(`${toPath}/${newPath}`);
          if (readDir.length >= 2) {
            console.log(`跳过 ${clearId}`);
            fs.unlinkSync(fPath);
            return false;
          } else {
            deleteFolder(`${toPath}/${newPath}`);
          }
        }
        // 创建新文件夹
        fs.mkdirSync(`${toPath}/${newPath}`);
        // 将当前的文件拷贝到新文件夹中
        fs.copyFileSync(fPath, `${toPath}/${newPath}/${newTitle}`);
        // 删除当前文件
        fs.unlinkSync(fPath);
      }

      // 或者封面图的DOM
      const imgDom = $($(".screencap")[0]).find("img");
      if (imgDom) {
        // 获取封面图 URL
        const src = imgDom.attr("src");
        // 拼接封面图地址
        const coverUrl = `${config.LIBRARY_URL}${src}`;
        // 下载封面图
        download(
          coverUrl,
          `${toPath}/${newPath}`,
          `${newPath}.${src.match(lastRegx)[0]}`
        );
      }
    }
  });
};

const init = function (fromFile, toPath) {
  if (fs.existsSync(fromFile)) {
    // 获取路径名
    const pathArr = fromFile.split("/");
    // 获取文件名
    const fileName = pathArr[pathArr.length - 1];
    // 配置忽略文件
    if (config.IGNORE_FILES.includes(fileName)) return false;
    // 获取文件状态
    let stat = fs.statSync(fromFile);
    if (stat.isFile()) {
      buildFile(fileName, fromFile, toPath);
    }
  }
};

const batch = function (fromPath, toPath) {
  // 查找所有的种子
  function findFile(filePath, toPath, isRecurrence) {
    // 读文件系统
    let files = fs.readdirSync(filePath);
    // 遍历每一个文件
    files.forEach(function (item, index) {
      // 拼接文件地址
      let fPath = path.join(filePath, item);
      // 获取文件状态
      let stat = fs.statSync(fPath);
      // 配置忽略文件
      if (config.IGNORE_FILES.includes(item)) return false;
      // 循环递归
      if (isRecurrence && stat.isDirectory() === true) {
        findFile(fPath);
      }
      // 找到文件
      if (stat.isFile() === true) {
        buildFile(item, fPath, toPath);
      }
    });
  }
  // 执行
  findFile(fromPath, toPath);
};

module.exports = { batch, init };

// 使用示例：
// batch(path.resolve("./demo"), path.resolve("./demo2"));
// init(path.resolve('./demo/FSDSS-314.mp4'), path.resolve('./demo2'))
