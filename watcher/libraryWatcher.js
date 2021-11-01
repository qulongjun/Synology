const path = require("path");
// const watcher = require("./watcher");
const config = require('../config');
const { batch, init } = require("../utils/searchLibrary");

// const args = process.argv.slice(2);

// const callbacks = function (watchType, file, status) {
//   if (watchType === "create") {
//     // 全部执行
//     if (args[0] === "--all") {
//       batch(config.LIBRARY_WATCH_PATH, config.LIBRARY_TARGET_PATH);
//     } else {
//       // 单个执行
//       init(file, config.LIBRARY_TARGET_PATH);
//     }
//   }
// };

const initWatcher = function () {
    batch(config.LIBRARY_WATCH_PATH, config.LIBRARY_TARGET_PATH);
    //   watcher(config.LIBRARY_WATCH_PATH, callbacks);
};

initWatcher();
