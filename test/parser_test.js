var assert = require('assert'),
    argo = require('argo'),
    Stream = require('stream'),
    subdomain = require('../'),
    util = require('util');


function Request(mockHost) {
    if(mockHost) {
      this.headers = {'host':'subdomain.example.com'};
    } else {
      this.headers = {};
    }
    this.chunks = [];
    Stream.Duplex.call(this);
}
util.inherits(Request, Stream.Duplex);

Request.prototype._read = function(size) {
    var chunk = this.chunks.length ? this.chunks.shift() : null;
    this.push(chunk);
};

Request.prototype._write = function(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
};

function Response() {
    this.headers = {};
    this.statusCode = 0;
    this.body = null;
    this.chunks = [];
    Stream.Duplex.call(this);
}
util.inherits(Response, Stream.Duplex);

Response.prototype._read = function(size) {
    var chunk = this.chunks.length ? this.chunks.shift() : null;
      this.push(chunk);
};

Response.prototype._write = function(chunk, encoding, callback) {
    this.chunks.push(chunk);
      callback();
};

Response.prototype.setHeader = function(k, v) {
    this.headers[k] = v;
};

Response.prototype.writeHead = function(s, h) {
    this.statusCode = s;
    this.headers = h;
};

Response.prototype.getHeader = function(k) {
    return this.headers[k];
};

Response.prototype.end = function(b) {
    this.body = b;
};

function _getEnv(mockHost) {
    return { 
      request: new Request(mockHost),
      response: new Response(),
      target: {},
      argo: {}
    };
}

describe('subdomain parser', function() {
  it('parses out the subdomain from a request host header, and places it in the env', function(done) {
    var server = argo();
    server.use(subdomain);
    server.use(function(handle) {
      handle('response', function(env, next) {
        assert.ok(env.request.subdomain);
        done();
      });
    })
    .call(_getEnv(true));
  });

  it('parses out the subdomain, and removes the host and tld', function(done) {
    var server = argo();
    server.use(subdomain);
    server.use(function(handle) {
      handle('response', function(env, next) {
        assert.equal(env.request.subdomain, 'subdomain');
        done();
      });
    })
    .call(_getEnv(true));
  });

  it('does nothing when no host header present', function(done) {
    var server = argo();
    server.use(subdomain);
    server.use(function(handle) {
      handle('response', function(env, next) {
        assert.ok(!env.request.subdomain);
        done();
      });
    })
    .call(_getEnv(false));
  });
});

