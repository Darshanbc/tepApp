'use strict';
var log4js = require('log4js');
log4js.configure({
	appenders: { mainApp: { type: 'file', filename: 'nodeApp.log' } },
	categories: { default: { appenders: ['mainApp'], level: 'trace' } }
  });
var PromiseA = require('bluebird').Promise;
var logger = log4js.getLogger('kafkaWebApp');
var express = require('express');
// var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
// var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
// Kafka configuration
var md5=require('md5')
var ursa=require('ursa');
var path =require("path")
var fs = require('fs');
var config=require('./config.json');
var generateKeys=require("./app/generateKeys");
var symEnc=require('./app/symcrypto.js');
var host = config.HOST
var port = config.PORT 
var helper=require('./app/helper.js')
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
//////////////////////////////////////////////////////////////////////
/////////
var server = http.createServer(app).listen(port, function() {});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************',host,port);
server.timeout = 240000;

function getErrorMessage(code) {
	var response = {
		success: false,
		error: code
	};
	return response;
}
function onFailure(err){
	logger.error(err.toString())
}

function generateMuid(phoneNumber,imei,tepid){
	return new Promise((resolve,reject)=>{
		try {
			var muid=(md5(phoneNumber+imei+tepid))
			console.log(muid)
			resolve(muid)
		} catch (error) {
			reject(error)
		}
	});
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
app.post("/mobileSignup",async function(req, res){

	logger.info("<<<<<<<<<<END POINT: mobileSignup>>>>>>>>>>>>>>>>>>>");
    // logger.debug("User name"+username);
    
	if(!req.body.phoneNumber){
		res.json(getErrorMessage(201));
        return;
	}if(!req.body.tepid){
		res.json(getErrorMessage(202));
        return;
	}if(!req.body.imei && req.body.imei==="UNKNOWN"){
		res.json(getErrorMessage(203));
		return;
	}else{
			generateMuid(req.body.phoneNumber,req.body.imei,req.body.tepid).then(muid=>{
				helper.putUser(req.body.phoneNumber,req.body.imei,req.body.tepid,muid)
				.then(logger.debug("userData put into Datbase"))
				.catch(function(err){
					res.json(getErrorMessage(100))
				})
				encrypt(muid).then(enc=>res.json({success:true,token:null,muid:enc})).catch(function(err){
					onFailure(err.toString())
					res.json(getErrorMessage(205))//eror while encryption
				})
			}).catch(function(err){
				onFailure(err.toString())
				res.json(getErrorMessage(204)) //error while hashing
			})

};
})

app.post("/getTripId",async function(req,res){
	logger.info("<<<<<<<<<<<<GET TRIP ID>>>>>>>>>>>>>>>>>>>")
	res.json({"tripId":0});
	
})

// generateMuid(req.body.phoneNumber,req.body.imei,req.body.tepid).then(muid=>{
// 	PromiseA.all([
// 		// generateKeys.keypair(config.keyStore+"/"+muid),
// 		symEnc.encrypt(muid,fs.readFileSync(path.join(config.keyStore,muid,"privkey.pem")))
// 	  ]).then(function (keys) {
// 		//   console.log(keys[0]);
// 		//   encrypt(keys[0]).then( enc => 
// 			res.json({symkey:enc,asymkey:keys[0]})		
// 	  }).catch(onFailure)


// })

// db.test.update({_id:5},{"a":"c"},{upsert:true})