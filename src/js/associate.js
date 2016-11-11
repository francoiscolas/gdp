//=include lib/jquery-fix.js
//=include lib/jquery.js
//=include lib/underscore.js

$(function () {

  var App = require('electron').remote.getGlobal('App');
  var OS  = require('os');

  $('#ip').text(
    _.reduce(OS.networkInterfaces(), function (memo, addresses) {
      var local = _.find(addresses, addr => addr.address.startsWith('192.168.'));
      return (local) ? local.address : memo;
    }, undefined)
  );

  App.settings.get('httpPort').then(port => {
    $('#port').text(port);
  });

});
