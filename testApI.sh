# curl -s -X POST \
#   http://localhost:4000/login \
#   -H "content-type: application/json" \
#   -d '{
#     "email":"darshan010@gmail.com"
#   }'

  curl -s -X POST \
  http://18.218.96.99:4000/mobileSignup \
  -H "content-type: application/json" \
  -d '{"tepid":"Jim",
        "lastName":"Johnson.",
        "phoneNumber":"8904374405",
        "email":"darshan010@gmaxil.com",
        "dob":"11-01-1992 00:00:00",
        "password":"Password123",
        "imei":"2343749872309178090"
        }'

#  TOKEN=$(echo $TOKEN | jq ".message.token" | sed "s/\"//g")
#  echo $TOKEN


# curl -s -X POST \
#   http://localhost:4000/dataReceive \
#   -H "authorization: Bearer $TOKEN" \
#   -H "content-type: application/json" \
#   -d '{"data":{
#     "routeStatus":[
#         {
#             "driveCrashId":0,
#             "driveDate":"29-01-02 23:19.13",
#             "tripId":4
#         },
#         {
#             "driveCrashId":0,
#             "driveDate":"29-01-02 23:19.13",
#             "tripId":4
#         }
#     ],
#     "tripEndDate":"29-01-02 23:19.13",
#     "tripMobIMEI":"456423416576545"
#     "tripStartLocLat":11.056345465,
#     "tripStartLocLng":76.13575435,
#     "tripStopLocLat":11.10356865,
#     "tripStopLocLng":77.416543254
# }}'


# {
#     "routeStatus":[
#         {
#             "driveCrashId":0,
#             "driveDate":"29-01-02 23:19.13",
#             "tripId":4
#         },
#         {
#             "driveCrashId":0,
#             "driveDate":"29-01-02 23:19.13",
#             "tripId":4
#         }
#     ],
#     "tripEndDate":"29-01-02 23:19.13",
#     "tripMobIMEI":"456423416576545"
#     "tripStartLocLat":11.056345465,
#     "tripStartLocLng":76.13575435,
#     "tripStopLocLat":11.10356865,
#     "tripStopLocLng":77.416543254
# }