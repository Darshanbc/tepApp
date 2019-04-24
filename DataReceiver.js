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
var asymcrypto=require('./app/asymcrypto.js')
var helper=require('./app/helper.js')
var host = config.HOST
var port = 5000


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

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}
function onFailure(err){
	logger.error(err.toString())
}

app.post("/dataReceive",async function(req, res){

	logger.info("<<<<<<<<<<END POINT: mobileSignup>>>>>>>>>>>>>>>>>>>");
    // logger.debug("User name"+username);
    // console.log("Requests Body: "+JSON.stringify(req.body));
	if(!req.body.key){
		res.json(getErrorMessage('\'key\''));
        return;
	}if(!req.body.Data){
		res.json(getErrorMessage('\'Data\''));
        return;
	}else{
        var message={};
        
        message.key=req.body.key;
		message.Data=req.body.Data;
		var topic=config.topic.DataPool;
        helper.produceuser(message,topic,res).then(data=>{
            res.send(data);
        });
        
        // res.send("OK!");
    };
})

app.post("/missedDataReceive",async function(req,res){
	logger.info("<<<<<<<<<<<<<<<<<<<<<<<<END POINT: missedDataReceive>>>>>>>>>>>>>>>>>>>>");
	if(!req.body.key){
		res.json(getErrorMessage('\'key\''))
	} else if(!req.body.Data){
		res.json(getErrorMessage('\'Data\''))
	}else{
		var topic=config.topic.DataPool
		var message={};
        
        message.key=req.body.key;
		message.Data=req.body.Data;
		
		helper.putMissedData(message,topic,res).then(data=>{
			// console.log(JSON.stringify(data).indexOf(topic))
			// if(data.success==true){
				res.send(data)
			// }else{
				// res.json({success:true})
			// }
			// res.json({success:true})
		})
	}

})

