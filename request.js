var request = require('request');
var ursa=require('ursa');
var crypto=require('crypto')
var fs =require('fs');
var symenc=require('./app/symcrypto');
var PromiseA = require('bluebird').Promise;
var asymcrypto=require('./app/asymcrypto')
muid="081af1d853f2ed251e8dad71f1eae12e";

var headers = {
    'content-type': 'application/json',
}


// var data = '{"tepid":"Jim","lastName":"Johnson.","phoneNumber":"8904374405","email":"darshan010@gmail.com","dob":"11-01-1992 00:00:00","password":"Password123","imei":"2343749872309178090"}'
// var driveData={"data":[
//     {"driveCrashEventId": 0,
//     "driveCrashIndex": 0,
//     "driveCrashNo": 0,
//     "driveDate": "2019-02-13 11:58:10.358",
//     "driveEventUploaded": false,
//     "driveHeaviness": 0,
//     "driveType": "DISCONNECTED",
//     "eventID": 6,
//     "muid": "e485df619a6b5c9bbc7e074b6d44158e",
//     "tripId": 2,
//     "tripState": "RUNNING"},
//     {
//     "driveCrashEventId": 0,
//     "driveCrashIndex": 0,
//     "driveCrashNo": 0,
//     "driveDate": "2019-02-13 11:58:10.358",
//     "driveEventUploaded": false,
//     "driveHeaviness": 0,
//     "driveType": "DISCONNECTED",
//     "eventID": 7,
//     "muid": "e485df619a6b5c9bbc7e074b6d44158e",
//     "tripId": 2,
//     "tripState": "RUNNING"
//     },
//     {
//     "driveCrashEventId": 0,
//     "driveCrashIndex": 0,
//     "driveCrashNo": 0,
//     "driveDate": "2019-02-13 11:58:10.358",
//     "driveEventUploaded": false,
//     "driveHeaviness": 0,
//     "driveType": "DISCONNECTED",
//     "eventID": 8,
//     "muid": "e485df619a6b5c9bbc7e074b6d44158e",
//     "tripId": 2,
//     "tripState": "RUNNING"
//     },
//     {
//     "driveCrashEventId": 0,
//     "driveCrashIndex": 0,
//     "driveCrashNo": 0,
//     "driveDate": "2019-02-13 11:58:10.358",
//     "driveEventUploaded": false,
//     "driveHeaviness": 0,
//     "driveType": "DISCONNECTED",
//     "eventID": 9,
//     "muid": "e485df619a6b5c9bbc7e074b6d44158e",
//     "tripId": 2,
//     "tripState": "RUNNING"
//     },
//     {
//     "driveCrashEventId": 0,
//     "driveCrashIndex": 0,
//     "driveCrashNo": 0,
//     "driveDate": "2019-02-13 11:58:10.358",
//     "driveEventUploaded": false,
//     "driveHeaviness": 0,
//     "driveType": "DISCONNECTED",
//     "eventID": 10,
//     "muid": "e485df619a6b5c9bbc7e074b6d44158e",
//     "tripId": 2,
//     "tripState": "RUNNING"
//     }
//     ]
//     }
//     driveData=JSON.stringify(driveData)
// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     }
// }


// console.log(driveData)
// PromiseA.all([
//     symenc.encrypt(muid,driveData),
//     asymcrypto.encrypt(muid)
// ]).then((encData)=>{
//     console.log("encData[0] :"+encData[0]+", encData[1]: "+encData[1])
//     var reqData={key:encData[1],Data:encData[0]};
//     var options = {
//         url: 'http://18.218.96.99:5000/dataReceive',
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(reqData)
//     };
    
//     request(options, callback)
// })

var encData="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"
var enckey="hMjl7lOLbVj2FuwhXIVg70McKO5DoXmjLN13/CDge+z7GmvjcROMNpBQn1u75R5JC7DRom1ESm76jc9aOf8uGP9GhBvTuPYrY2Uml5GwEvNI7EDTJMiTi8Vh1DvNrUakzWRszsEZI0O2jd+rHm2/y4D4KjmgzTLlU69QqzXPgIY="

var reqData={key:enckey,Data:encData};
var options={
    url:'http://18.218.96.99:5000/missedDataReceive',
    method:"POST",
    headers:headers,
    body:JSON.stringify(reqData)
};
request(options,callback)
var callback= function(response){
    console.log(response)
}

