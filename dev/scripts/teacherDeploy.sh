#!/bin/bash

timeStamp=$(date +%d%m%Y_%T);

# creating backup for clientTeacher
backupFolderName='/var/www/backup/clientTeacher/dist'$timeStamp;
# mkdir $backupFolderName;
# cp -R /var/www/smartchat/clientTeacher/dist/* $backupFolderName && echo "backup is created";

#updating client_config.js to set production true
file=$(find /var/www/poligon/clientTeacher/ -maxdepth 1 -name "client_config.js");

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
	echo "file not found. see /var/www/poligon/clientTeacher/client_config.js";
	exit 1;
fi
#building clientTeacher
cd /var/www/poligon/clientTeacher/ && yarn build;

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
	echo "file not found. see /var/www/poligon/clientTeacher/client_config.js";
	exit 1;
fi


#deploying clientTeacher
rm -rf /var/www/smartchat/clientTeacher/dist;
cp -R /var/www/poligon/clientTeacher/dist /var/www/smartchat/clientTeacher && echo "dist successfully deployed";

#creating backup for apiTeacher
apibackup='/var/www/backup/apiTeacher/server'$timeStamp;
# mkdir $apibackup;
# cp -R /var/www/smartchat/apiTeacher/* $apibackup && echo "server backup successfully created";

#deploying apiTeacher
rm -rf /var/www/smartchat/apiTeacher;
cp -R /var/www/poligon/apiTeacher /var/www/smartchat && echo "teacher server successfully deployed";

#deploying models & functions
cd /var/www/poligon/scripts && bash modelsDeploy.sh;
cd /var/www/poligon/scripts && bash functionsDeploy.sh;

#restarting server
pm2 delete teacher && echo "server has stopped";
cd /var/www/smartchat/apiTeacher && pm2 start teacher.js;

echo "Completed! check your updates https://cabinet.smartchat.kz";