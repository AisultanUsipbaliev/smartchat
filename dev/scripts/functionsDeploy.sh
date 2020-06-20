#!/bin/bash

timeStamp=$(date +%d%m%Y_%T);

# creating backup for service
backupFolderName='/var/www/backup/functions/functions'$timeStamp;
# mkdir $backupFolderName;
# cp -R /var/www/smartchat/apiFunctions/* $backupFolderName && echo "backup is created";

#deploying service
rm -rf /var/www/smartchat/apiFunctions;
cp -R /var/www/poligon/apiFunctions /var/www/smartchat && echo "functions successfully deployed";

#restarting server
# pm2 restart service
# pm2 restart teacher
# pm2 restart student