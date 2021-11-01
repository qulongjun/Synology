#!/bin/bash

echo "触发 Library 脚本监听"

node ./watcher/libraryWatcher.js

# forever -o /volume1/日志中心/脚本日志/out/library.log -e /volume1/日志中心/脚本日志/err/library.log -w /volume1/script/Synology/watcher/libraryWatcher.js --all
