//=include lib/jquery-fix.js
//=include lib/jquery.js

$(function () {

  var Electron = require('electron');
  var Dialog   = Electron.remote.dialog;
  var App      = Electron.remote.getGlobal('App');

  var $sourcesDir = $('#sources-dir-input');
  var $bgColor    = $('#bg-color-input');
  var $bgImage    = $('#bg-image-input');

  var save = function (event) {
    App.sources.setSourcesDir($sourcesDir.val());
    App.display.set({
      bgColor: $bgColor.val(),
      bgImage: $bgImage.val(),
    });
    window.close();
  };

  $sourcesDir.val(App.sources.sourcesDir);
  $('#sources-dir-btn').click(function () {
    var entries = Dialog.showOpenDialogSync({
      defaultPath: $sourcesDir.val(),
      properties : ['openDirectory']
    });

    if (entries)
      $sourcesDir.val(entries[0]);
  });

  $bgColor.val(App.display.bgColor);

  $bgImage.val(App.display.bgImage);
  $('#bg-image-btn').click(function () {
    var entries = Dialog.showOpenDialogSync({
      defaultPath: $bgImage.val(),
      properties : ['openFile'],
      filters    : [{name: 'Images', extensions: ['jpg', 'jpeg', 'png']}],
    });

    if (entries)
      $bgImage.val(entries[0]);
  });

  $('#cancel-btn').click(window.close);
  $('#save-btn').click(save);

});
