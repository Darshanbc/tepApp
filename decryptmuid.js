var requests = require('requests');
var ursa=require('ursa');
var crypto=require('crypto')
var fs =require('fs');


// var headers = {
//     'content-type': 'application/json',
// }


// var data = '{"tepid":"Jim",\n        "lastName":"Johnson.",\n        "phoneNumber":"8904374405",\n        "email":"darshan010@gmaxil.com",\n        "dob":"11-01-1992 00:00:00",\n        "password":"Password123",\n        "imei":"2343749872309178090"\n        }'

// response = requests.post('http://18.218.96.99:4000/mobileSignup', headers=headers, data=data)

var decrypt=function(data){
    return new Promise((resolve,reject)=>{
        var pubKey=ursa.createPublicKey(fs.readFileSync('./keyStore/server/pubkey.pem'));
        try{
            var dec=pubKey.publicDecrypt(data,'base64','hex')
            resolve(dec)
        }catch(err){
            reject(err.toString());
        }
    })
}
decrypt("P1G/ieOERBXiCaqcb4cGThcTFc/3uwlsrOP8tO2eluhfvMXwouXMdhDlGjodABPMned2xwMj9m0gSTVWX22aJLamq/YAC7kuwjp2v9fal2yUvzHF+FpXLUVU6Uu2pYfJUlCshI2A1ozB08J3IgcXfbsBFygtT737PsQ3S11s8hI=")
    .then(muid=>{
        console.log("muid:"+muid)});