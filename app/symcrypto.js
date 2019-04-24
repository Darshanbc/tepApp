
var crypto = require('crypto');

var algorithm = 'aes-256-ecb';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';


var encrypt=function(key,text){

    return new Promise((resolve,reject)=>{
        try{
            var cipher = crypto.createCipher(algorithm, key);
            var ciphered = cipher.update(text, inputEncoding, outputEncoding);
            ciphered += cipher.final(outputEncoding);
            resolve(ciphered)
        }catch(err){
            reject(err.toString());
        }
    });

}

var decrypt=function(encData,key){
    return new Promise((resolve,reject)=>{
        try{
        // var cipherText=Buffer.from(ciphered)
        var cipherBuffer= new Buffer(encData,'base64')
        var decipher = crypto.createDecipheriv(algorithm, key,'');
        var deciphered = decipher.update(cipherBuffer)//, decEncoding, decEncoding);    
        deciphered += decipher.final();
        resolve(deciphered)
        }catch(err){
            reject(err.toString())
        }
        
    })
}

// console.log(deciphered);
// assert.equal(deciphered, text, 'Deciphered text does not match!');

exports.encrypt=encrypt;
exports.decrypt=decrypt