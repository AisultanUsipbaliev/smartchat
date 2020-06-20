#!/bin/bash

timeStamp=$(date +%d%m%Y_%T);

# creating backup for service
backupFolderName='/var/www/backup/service/service'$timeStamp;
# mkdir $backupFolderName;
# cp -R /var/www/smartchat/service/* $backupFolderName && echo "backup is created";

#deploying service
rm -rf /var/www/smartchat/service;
cp -R /var/www/poligon/service /var/www/smartchat && echo "service successfully deployed";

#deploying models & functions
cd /var/www/poligon/scripts && bash modelsDeploy.sh;
cd /var/www/poligon/scripts && bash functionsDeploy.sh;

#restarting server
pm2 delete service
cd /var/www/smartchat/service && pm2 start service.js;