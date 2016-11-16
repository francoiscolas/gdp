var _        = require('lodash');
var Electron = require('electron');

var initSettings = function () {
  App.settings = require('electron-settings');
  App.settings.defaults({
    version: 0x020000,
    httpPort: 3333,
    display: {
      bgColor: 'black',
      bgImage: null,
    },
    sourcesDir: null,
  });
  return Promise.resolve();
};

var initDisplay = function () {
  return new Promise(function (resolve, reject) {
    App.settings.get('display').then(function (settings) {
      var Display = require('./display');

      App.display = new Display({
        bgColor: settings.bgColor,
        bgImage: settings.bgImage
      });
      App.display.on('change', function () {
        App.settings.set('display', {
          bgColor: App.display.bgColor,
          bgImage: App.display.bgImage
        });
      });
      resolve();
    });
  });
};

var initSources = function () {
  return new Promise(function (resolve, reject) {
    App.settings.get('sourcesDir').then(function (sourcesDir) {
      var Sources = require('./sources');

      App.sources = new Sources();
      App.sources.on('error', function (error) {
        Electron.dialog.showErrorBox('Sources introuvables', error.message);
      });
      App.sources.on('change', function () {
        App.settings.setSync('sourcesDir', App.sources.sourcesDir);
      });
      App.sources.setSourcesDir(App.settings.getSync('sourcesDir'));
      App.sources.setUserDir(App.getPath('userData'));
      resolve();
    });
  });
};

var startWebApp = function () {
  return new Promise(function (resolve, reject) {
    var Express         = require('express');
    var JsonBodyParser  = require('body-parser').json();
    var DisplayApi      = require('./webapp/api/display')(App);
    var SourcesApi      = require('./webapp/api/sources')(App);

    App.webApp = Express();
    App.webApp.use(Express.static(`${__dirname}/webapp/public`));
    App.webApp.use(Express.static(`${__dirname}/assets`));
    App.webApp.set('env', (App.isDev) ? 'development' : 'production');
    App.webApp.get('/api/display', DisplayApi.show);
    App.webApp.get('/api/display/bgImage', DisplayApi.bgImage);
    App.webApp.post('/api/display', JsonBodyParser, DisplayApi.update);
    App.webApp.delete('/api/display', DisplayApi.clear);
    App.webApp.get('/api/sources', SourcesApi.index);
    App.webApp.get('/api/sources/:id', SourcesApi.show);
    App.webApp.get('/api/sources/:id/:i.jpg', SourcesApi.slide);

    var server = App.webApp.listen(App.settings.getSync('httpPort'));
    server.once('listening', resolve);
    server.once('error', reject);
  });
};

var startUi = function () {
  return new Promise(function (resolve, reject) {
    var r = _.after(2, resolve);

    startScreenWindow().then(r);
    startMainWindow().then(r);
  });
};

var startScreenWindow = function () {
  return new Promise(function (resolve, reject) {
    App.screenWindow = new Electron.BrowserWindow({
      icon: `${__dirname}/assets/img/icon.png`,
      show: false
    });
    App.screenWindow.loadURL(`file://${__dirname}/ui/screen.html`);
    App.screenWindow.setMenu(null);
    App.screenWindow.on('closed', function () {
      App.screenWindow = null;
      App.quit();
    });
    App.screenWindow.on('ready-to-show', function () {
      var primary  = Electron.screen.getPrimaryDisplay();
      var external = Electron.screen.getAllDisplays().find(display => display.id != primary.id);

      if (external) {
        var pos = external.workArea;
        App.screenWindow.setPosition(pos.x, pos.y);
      }
      App.screenWindow.show();
      App.screenWindow.setFullScreen(true);
      resolve();
    });
  });
};

var startMainWindow = function () {
  return new Promise(function (resolve, reject) {
    App.mainWindow = new Electron.BrowserWindow({
      icon: `${__dirname}/assets/img/icon.png`,
      show: false,
      width: 1200,
      height: 600,
    });
    App.mainWindow.loadURL('http://localhost:' + App.settings.getSync('httpPort'));
    App.mainWindow.on('closed', function () {
      App.mainWindow = null;
      App.quit();
    });
    App.mainWindow.on('ready-to-show', function () {
      var primary = Electron.screen.getPrimaryDisplay();
      var x       = (primary.size.width - App.mainWindow.getSize()[0]) / 2;
      var y       = (primary.size.height - App.mainWindow.getSize()[1]) / 2;

      App.mainWindow.setPosition(x, y);
      App.mainWindow.show();
      resolve();
    });
    App.mainWindow.setMenu((function () {
      var template = [];

      template.push({
        label: App.getName(),
        accelerator: 'Alt+G',
        submenu: [{
          label: 'Associer un appareil',
          click() {
            startAssociateWindow();
          }
        }, {
          type: 'separator',
        }, {
          label: 'Paramètres',
          click() {
            startSettingsWindow();
          }
        }, {
          type: 'separator',
        }, {
          label: 'À propos',
          click() {
            startAboutWindow();
          }
        }, {
          label: 'Quitter',
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit',
        }]
      });
      if (App.isDev) {
        template.push({
          label: 'Dev',
          submenu: [{
            label: 'Open dev tools',
            click() {
              App.mainWindow.openDevTools();
            }
          }]
        });
      }
      return Electron.Menu.buildFromTemplate(template);
    })());
  });
};

var launched = function () {
  App.launched = true;
  App.emit('launched');
  return Promise.resolve();
};

var launch = function (resolve, reject) {
  initSettings()
    .then(initDisplay)
    .then(initSources)
    .then(startWebApp)
    .then(startUi)
    .then(launched)
    .catch(reject);
};

var startSettingsWindow = function () {
  var win = new Electron.BrowserWindow({
    parent: App.mainWindow,
    modal: true,
    icon: `${__dirname}/assets/img/icon.png`,
    show: false,
    width: 300,
    height: 340,
  });
  win.loadURL(`file://${__dirname}/ui/settings.html`);
  win.setMenu(null);
  win.on('ready-to-show', function () {
    win.show();
  });
};

startAssociateWindow = function () {
  var win = new Electron.BrowserWindow({
    parent: App.mainWindow,
    modale: true,
    icon: `${__dirname}/assets/img/icon.png`,
    show: false,
    width: 300,
    height: 350,
  });
  win.loadURL(`file://${__dirname}/ui/associate.html`);
  win.setMenu(null);
  win.on('ready-to-show', function () {
    win.show();
  });
};

startAboutWindow = function () {
  var win = new Electron.BrowserWindow({
    parent: App.mainWindow,
    modale: true,
    icon: `${__dirname}/assets/img/icon.png`,
    show: false,
    width: 350,
    height: 250,
  });
  win.loadURL(`file://${__dirname}/ui/about.html`);
  win.setMenu(null);
  win.on('ready-to-show', function () {
    win.show();
  });
};

var App = module.exports = _.extend(Electron.app, {

  version: require('./package.json').version,

  isDev: !!process.env.DEV,

  settings: null,

  display: null,

  sources: null,

  webApp: null,

  mainWindow: null,

  screenWindow: null,

  launched: false,

  launch: _.once(function () {
    var that = this;

    return new Promise(function (resolve, reject) {
      if (that.isReady())
        launch(resolve, reject);
      else
        that.on('ready', _.bind(launch, launch, resolve, reject));
    });
  })

});
