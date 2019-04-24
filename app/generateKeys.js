var PromiseA = require('bluebird').Promise;
var fs = PromiseA.promisifyAll(require('fs'));
var path = require('path');
var ursa = require('ursa');
var mkdirpAsync = PromiseA.promisify(require('mkdirp'));
var keypair=function (pathname) {
    var key = ursa.generatePrivateKey(1024, 65537);
    var privpem = key.toPrivatePem();
    // console.log(privpem)
    var pubpem = key.toPublicPem();
    // var KeyStorePath=path.join(__dirname,config.keyStore) __dirname,config.keyStore,
    var privkey = path.join(pathname, 'privkey.pem');
    var pubkey = path.join(pathname, 'pubkey.pem');
    console.log("publickey Path :"+pubkey)
    return mkdirpAsync(pathname).then(function () {
      return PromiseA.all([
        fs.writeFileAsync(privkey, privpem, 'ascii')
      , fs.writeFileAsync(pubkey, pubpem, 'ascii')
      ]);
    }).then(function () {
      return privpem.toString('ascii');
    });
  }

  exports.keypair=keypair;
