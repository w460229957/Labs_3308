#!/bin/bash
# Authors : Zhengyuan Zhang
# Date: 09/26/2020

cp /var/log/syslog /home
echo "phase1:copy"
cp /home/syslog /home/zhengyuanzhang/Documents/lab_4
egrep -i "error" syslog|tee "error_log_check.txt"
echo "Sending the result to your E-mail"
echo "System Error log" | mutt -s "System Error log" -a error_log_check.txt -- zhzh4689@colorado.edu
