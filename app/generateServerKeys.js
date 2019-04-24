
'use strict';

var PromiseA = require('bluebird').Promise;

var config=require('../config.json')
var generateKeys=require('./generateKeys')

PromiseA.all([
  generateKeys.keypair(config.keyStore+"/server")
]).then(function (keys) {
  console.log(keys);
});
