var url = require('url');

module.exports = function(handle) {
  handle('request', function(env, next) {
    if(env.request.headers['host']) {
      var host = env.request.headers['host'];
      var tldRemoved = host.substring(0, host.lastIndexOf('.'));
      var subdomain = tldRemoved.substring(0, tldRemoved.lastIndexOf('.'));
      env.request.subdomain = subdomain;
      next(env);
    } else {
      next(env);
    }
  });
};

