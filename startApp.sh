#!/bin/bash
#

#

#check if port is free
PROCESS=$(sudo netstat -ntlp|grep 4000)
# echo $PROCESS
 if [ -z "$PROCESS" -o "$PROCESS" = " " ]; then
    echo "===========PORT AVAILABLE=========="
    echo
    echo '============STARTING APPLICATION============='
    nodemon app.js
else
    echo "================PORT BUSY======================"
    echo 
    PID=$(echo $PROCESS | sed 's/.* //' |sed 's/[^0-9]*//g') 
    echo "================KILLING PROCESS==============="
    echo $PID
    echo 
    echo "==================STARTING APPLICATION===================" 
    sudo kill -9 $PID
    sleep 3
    nodemon app.js
fi