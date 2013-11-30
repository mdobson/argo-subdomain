Subdomain parser for argo.
==========================

Simple middleware for argo that will parse out the subdomain attached to the host header and place it in the environment variable.

###Usage

```javascript
var subdomain = require('argo-subdomain');
var argo = require('argo');

argo()
  .use(subdomain)
  .use(function(handle) {
    handle('response', function(env, next) {
      console.log(env.request.subdomain);
      next(env);
    });
  })
  .listen(3000);
```
