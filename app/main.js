global.App = require('./app');
global.App.launch().catch(error => {
  console.error(error.stack);
  global.App.exit(1);
});
