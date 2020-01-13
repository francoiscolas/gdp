'use strict';

let ChildProcess = require('child_process');
let FS           = require('fs');
let Log          = require('electron-log');
let Path         = require('path');

let Converter = require('./converter');

const IS_DEV  = require('./is_dev');
const TAG     = 'ToPdfConverter';

const LIBREOFFICE_PATH = (function () {
  var isWin32  = (process.platform == 'win32');
  var isDarwin = (process.platform == 'darwin');
  var root     = null;

  if (isWin32 || isDarwin) {
    if (IS_DEV)
      root = Path.join(__dirname, '..', 'build', process.platform);
    else
      root = process.resourcesPath;
  }
  return (function () {
    if (root)
      return (isWin32)
        ? Path.join(root, 'LibreOffice', 'LibreOfficePortable')
        : Path.join(root, 'LibreOffice.app', 'Contents', 'MacOS', 'soffice');
    return 'libreoffice';
  })();
})();

class ToPdfConverter extends Converter {

  static from() {
    return ['odp', 'pps', 'ppt', 'pptx'];
  }

  static to() {
    return 'pdf';
  }

  convert(inputPath, outputPath) {
    super.convert(inputPath, outputPath);

    Log.debug(`${TAG}#convert> converting ${inputPath} to PDF`);
    return new Promise((resolve, reject) => {
      let dir = Path.dirname(outputPath);

      ChildProcess.execFile(LIBREOFFICE_PATH, [
        '--headless',
        '--convert-to', 'pdf',
        '--outdir', dir,
        inputPath
      ], (error) => {
        if (error) {
          Log.error(`${TAG}#convert> ${error.message}`, error);
          reject(error);
        } else {
          let oldPath = Path.join(dir, Path.parse(inputPath).name + '.pdf');

          Log.debug(`${TAG}#convert> rename ${oldPath} to ${outputPath}`);
          FS.rename(oldPath, outputPath, error => {
            if (error) {
              Log.error(`${TAG}#convert> ${error.message}`, error);
              reject(error);
            } else {
              resolve(outputPath);
            }
          });
        }
      });
    });
  }

}

module.exports = ToPdfConverter;
