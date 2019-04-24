var kafka = require('kafka-node')
var config=require('../config.json')
var log4js = require('log4js');
var symCrypto=require('./symcrypto')
var asymCrypto=require('./asymcrypto')
var Promise= require("bluebird")
log4js.configure({
	appenders: { mainApp: { type: 'file', filename: 'nodeApp.log' } },
	categories: { default: { appenders: ['mainApp'], level: 'trace' } }
  });
  var logger = log4js.getLogger('kafkaWebApp');
// instantiate client with as connectstring host:port for  the ZooKeeper for the Kafka cluster
// var zooKeeper="http://18.218.96.99:2181"


var produceuser=async function(msg,topic,res){
    console.log("topic: "+topic);
    var topicConfig={
            partitionerType:2,
            requireAcks: 1,
            ackTimeoutMs: 100,
            sessionTimeout:300,
            retries:2
    }
    console.log(msg.Data)
   messageBatch=[]
    return asymCrypto.decrypt(msg.key,res).then(function(key){
        console.log("decrypt key: "+key)
        return symCrypto.decrypt(msg.Data,key).then(function(Data){
            console.log("decrypt Data: "+Data)
            return createClient().then(function(kafkaClient){
                console.log("Kafka client created")
                return createProducer(kafkaClient,topicConfig).then(function(producer){
                    var parsedmsg=JSON.parse(Data)
                    console.log("Data from parsed msg"+JSON.stringify(Data))
                    messageBatch.push(JSON.stringify(parsedmsg));
                    console.log("Message sending: "+messageBatch)
                    return sendMessage(producer,messageBatch,topic,kafkaClient).then((result)=>{
                        // console.log("eventIDParse"+JSON.parse(Data).eventID)
                        // console.log("eventID"+Data.eventID)
                        var kafmsg=JSON.parse(Data)
                        var resp={}
                        resp.eventId=kafmsg.eventID
                        resp.tripId=kafmsg.tripId
                        resp.success=true
                        return resp 
                    })
                    .catch(function(err){
                        logger.error(err.toString())
                        return {"error":301}
                    })// error in sending message
                })
                .catch(function(err){
                    logger.error(err.toString())
                    return{"error":302}
                })//error for creating producer
            })
            .catch(function(err){
                logger.error(err.toString())
                return {"error":303}
            })// error for creating client
        })
        .catch(function(err){
            logger.error(err.toString())
            return {"error":304}
        })// error  for symmetric decrypt
    })
    .catch(function(err){
        logger.error(err.toString())
        return {"error":305}
    })// error for assymetric secrypt
    // decrypt data 
    
 
}

var createClient=async function(){
    return new Promise((resolve,reject)=>{
        try{
            console.log("creating client")
            var client=new kafka.KafkaClient({kafkaHost:config.HOST+":"+config.KAFKA_PORT});
            resolve(client)
        }catch(err){
            reject(err.toString());
        }
    });
}

var createProducer=async function(kafkaClient,topicConfig){
    return new Promise((resolve,reject)=>{
        try{
            console.log("creating Producer")
            const producer=new kafka.HighLevelProducer(kafkaClient,topicConfig)
            resolve(producer)
        }catch(err){
            reject(err.toString())
        }
    })
}

var sendMessage=async function(producer,message,topic){
    console.log("entered sendMesage")
    return new Promise((resolve,reject)=>{       
        try{     
            if(!JSON.parse(message[0]).driveLocLat||JSON.parse(message[0]).driveLocLat==0){
                reject("Invalid lattitude")
            }
            if(!JSON.parse(message[0].driveLocLng)||JSON.parse(message[0].driveLocLng)==0){
                reject("Invalid Longitude")
            }
            producer.on("ready",async function(){
                console.log("Sending Message to broker");
                const payload=[{topic:topic,messages:message}]
                producer.send(payload,async function(err,data){
                    if(err){
                        console.log(err.toString());
                    }else{   
                        // kafkaClient.close()
                        resolve(data)
                    }
                })   
                })
        }catch(err){
            reject(err.toString())
        }
    })
}

var putUser=async function(phoneNumber,imei,tepID,muid){
    var Data={};
    Data.phoneNumber=phoneNumber;
    Data.imei=imei;
    Data.tepID=tepID;
    Data._id=muid;
    var topicConfig={
        partitionerType:2,
        // Configuration for when to consider a message as acknowledged, default 1
        requireAcks: 1,
        // The amount of time in milliseconds to wait for all acks before considered, default 100ms
        ackTimeoutMs: 100,
       sessionTimeout:300,
       retries:2
    }
    var topic=config.topic.userData
    return createClient(config.HTTP_HOST,config.ZOOKEEPER_PORT,Data).then(function(kafkaClient){
        console.log("Kafka client created")
        return createProducer(kafkaClient,topicConfig,Data).then(function(producer){
            console.log("Message sending: "+Data)
            return sendMessage(producer,JSON.stringify(Data),topic,kafkaClient).then((result)=>{
                console.log(result)
                return result
            })
            .catch(function(err,res){
                logger.error(err.toString())
                res.json({"error":301})
            })// error in sending message
        })
        .catch(function(err,res){
            logger.error(err.toString())
            res.json({"error":302})
        })//error for creating producer
})
}

var putMissedData=async function(msg,topic,res){
    console.log("topic: "+topic);
    
    var topicConfig={
            partitionerType:2,
            requireAcks: 1,
            ackTimeoutMs: 100,
            sessionTimeout:300,
            retries:2
    }
    return asymCrypto.decrypt(msg.key).then(function(key){
        console.log("decryptedkey:"+key)
        return symCrypto.decrypt(msg.Data,key).then(function(Data){
            // console.log("decrypt Data: "+Data)
            return createClient().then(function(kafkaClient){
                console.log("Kafka client created")
                return createProducer(kafkaClient,topicConfig).then(function(producer){
                    console.log("Creating message ")
                    var message=JSON.parse(Data)
                    var data=message.data
                    var promiseArray=[]
                    data.forEach(event=>{
                        promiseArray.push(createMessage(event))
                    })
                    console.log("promise length:"+promiseArray.length)
                    return Promise.all(promiseArray).then(messsageBatch=>{
                        console.log(messsageBatch)
                        return sendMessage(producer,messsageBatch,topic,kafkaClient).then((brokerResponseMessage)=>{
                            console.log(brokerResponseMessage)
                            resp={};
                            resp.success=true
                            resp.tripId=data[0].tripId
                            console.log("response"+resp)
                            return resp
                        })
                        
                    })
                })
                .catch(function(err){
                    logger.error(err.toString())
                    // return err.toString()
                    return {error:301,success:false}
                   
                })//error for creating producer
            })
            .catch(function(err){
                logger.error(err.toString())
                // return err.toString()
                return {error:302,success:false}
                
            })// error for creating client
        })
        .catch(function(err){
            logger.error(err.toString())
                // return err.toString()
                return {error:303,success:false}
        })
        })
        .catch(function(err){
            logger.error(err.toString())
            // return err.toString()
            return {error:304,success:false}
        })// error  for symmetric decrypt
    // error for assymetric secrypt
    
 
}
var createMessage= function(Data){
    // var messageArray=[];
   
    return new Promise((resolve,reject)=>{
        try{
            resolve(JSON.stringify(Data));
        }catch(err){
            reject(err.toString())
        }
    })  
}


exports.putMissedData=putMissedData
exports.produceuser=produceuser
exports.putUser=putUser

