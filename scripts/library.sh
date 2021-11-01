#!/bin/bash

echo "触发 Library 脚本监听"

# node ./watcher/libraryWatcher.js --all

forever -o library.log -e library.log -w ./watcher/libraryWatcher.js --all