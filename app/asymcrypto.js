
var ursa=require('ursa');
var fs =require('fs');

var decrypt=function(data){
    return new Promise((resolve,reject)=>{
        var pubKey=ursa.createPublicKey(fs.readFileSync('./keyStore/server/pubkey.pem'));
        try{
            var dec=pubKey.publicDecrypt(data,'base64','hex')
            resolve(dec)
        }catch(err){
			console.log("error has occured")
            reject(err.toString());
        }
    })
}


function encrypt(data){
	return new Promise((resolve,reject)=>{
		var privkeyServer = ursa.createPrivateKey(fs.readFileSync('./keyStore/server/privkey.pem'));
		// console.log("PrivateKey: "+fs.readFileSync('./keyStore/server/privkey.pem'))
		try{
			var enc = privkeyServer.privateEncrypt(data,'hex',"base64")
			// console.log(enc)
		}catch(err){
			reject(err.toString());
		}

		resolve(enc);
		
	});
}

var privDecrypt=function(data){
	return new Promise((resolve,reject)=>{
		var privkey=ursa.createPrivateKey(fs.readFileSync('./keyStore/server/privkey.pem'));
		try{
			var dec=privkey.decrypt(data,'base64',"hex")
			resolve(dec)
		}catch(err){
			console.log("Error occured while decrypting muid");
			reject(err.toString())
		}
	})
}
exports.encrypt=encrypt;
exports.decrypt=decrypt;
exports.privdecrypt=privDecrypt;