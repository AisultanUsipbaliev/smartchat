#!/bin/bash

timeStamp=$(date +%d%m%Y_%T);

# creating backup for service
backupFolderName='/var/www/backup/models/models'$timeStamp;
# mkdir $backupFolderName;
# cp -R /var/www/smartchat/apiModels/* $backupFolderName && echo "backup is created";

#deploying service
rm -rf /var/www/smartchat/apiModels;
cp -R /var/www/poligon/apiModels /var/www/smartchat && echo "models successfully deployed";

#restarting server
# pm2 restart service
# pm2 restart teacher
# pm2 restart student