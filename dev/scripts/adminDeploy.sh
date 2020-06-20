#!/bin/bash

timeStamp=$(date +%d%m%Y_%T);

# creating backup for clientAdmin
backupFolderName='/var/www/backup/clientAdmin/dist'$timeStamp;
# mkdir $backupFolderName;
# cp -R /var/www/smartchat/clientAdmin/dist/* $backupFolderName && echo "backup is created";

#updating client_config.js to set production true
file=$(find /var/www/poligon/clientAdmin/ -maxdepth 1 -name "client_config.js");

if [[ $file ]]; then
	findStr=$(grep -i "let production = false;" $file);
	
	if [[ $findStr ]]; then
		str='let production = true;'
		printf '%s\n' H ",g/^let production = false;*/s//${str}/" wq | ed -s "$file";
		echo "production = true";
	else 
		findTrue=$(grep -i "let production = true;" $file)
		if [[ $findTrue ]]; then
			echo "production = true";
		else
			echo "production is not defined. see ${file}";
			exit 1;
		fi
	fi
else 
	echo "file not found. see /var/www/poligon/clientAdmin/client_config.js";
	exit 1;
fi
#building clientAdmin
cd /var/www/poligon/clientAdmin/ && yarn build;

#updating config to set production=false
if [[ $file ]]; then
        findStr=$(grep -i "let production = true;" $file);

        if [[ $findStr ]]; then
                str='let production = false;'
                printf '%s\n' H ",g/^let production = true;*/s//${str}/" wq | ed -s "$file";
                echo "production = false";
        else 
                findTrue=$(grep -i "let production = false;" $file)
                if [[ $findTrue ]]; then
                        echo "production = false";
                else 
                        echo "production is not defined. see ${file}";
                        exit 1;
                fi
        fi
else 
	echo "file not found. see /var/www/poligon/clientAdmin/client_config.js";
	exit 1;
fi


#deploying clientAdmin
rm -rf /var/www/smartchat/clientAdmin/dist;
cp -R /var/www/poligon/clientAdmin/dist /var/www/smartchat/clientAdmin && echo "dist successfully deployed";

#creating backup for apiAdmin
apibackup='/var/www/backup/apiAdmin/server'$timeStamp;
# mkdir $apibackup;
# cp -R /var/www/smartchat/apiAdmin/* $apibackup && echo "server backup successfully created";

#deploying apiAdmin
rm -rf /var/www/smartchat/apiAdmin;
cp -R /var/www/poligon/apiAdmin /var/www/smartchat && echo "admin server successfully deployed";

#deploying models & functions
cd /var/www/poligon/scripts && bash modelsDeploy.sh;
cd /var/www/poligon/scripts && bash functionsDeploy.sh;

#restarting server
pm2 delete admin && echo "server has stopped";
cd /var/www/smartchat/apiAdmin && pm2 start admin.js;


echo "Completed! check your updates https://admin.smartchat.kz";