'use strict';

let FS = require('fs');
let Path = require('path');

let MD5 = function (text) {
  return require('crypto').createHash('md5').update(text).digest('hex');
};

class SourcesDirEntry {

  constructor(absolutePath, stats) {
    let parsed = Path.parse(absolutePath);

    this.id = MD5(absolutePath);
    this.absolutePath = absolutePath; // /home/user/dir
    this.basename = parsed.base; // file.txt
    this.name = (stats.isFile()) ? parsed.name : null; // file
    this.ext = (stats.isFile()) ? parsed.ext.substring(1) : null; // txt
    this.stats = stats;
  }

  isDirectory() {
    return this.stats.isDirectory();
  }

  isFile() {
    return this.stats.isFile();
  }

}

module.exports = SourcesDirEntry;
