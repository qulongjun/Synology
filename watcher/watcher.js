const hound = require("hound");
const path = require("path");
/**
 * 文件夹监听执行方法
 * @param {*} fPath 需要监听的文件夹路径
 * @param {*} callbacks 监听到变化后的回调方法
 */
const watcher = function (fPath, callbacks) {
  const realPath = path.resolve(fPath);
  // 初始化一个监听器
  const listener = hound.watch(realPath);
  console.log(`开始监听${realPath}文件夹`);

  // 创建文件监听器
  listener.on("create", function (file, stats) {
    console.log(`监听到创建了文件：${file}`);
    callbacks && callbacks("create", file, stats);
  });

  // 修改文件监听器
  listener.on("change", function (file, stats) {
    console.log(`监听到修改了文件：${file}`);
    callbacks && callbacks("change", file, stats);
  });

  // 删除文件监听器
  listener.on("delete", function (file) {
    console.log(`监听到删除了文件：${file}`);
    callbacks && callbacks("delete", file);
  });
};

module.exports = watcher;
