#!/bin/bash

timeStamp=$(date +%d%m%Y_%T);

# creating backup for clientStudent
backupFolderName='/var/www/backup/clientStudent/dist'$timeStamp;
# mkdir $backupFolderName;
# cp -R /var/www/smartchat/clientStudent/dist/* $backupFolderName && echo "backup is created";

#updating client_config.js to set production true
file=$(find /var/www/poligon/clientStudent/ -maxdepth 1 -name "client_config.js");

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
	echo "file not found. see /var/www/poligon/clientStudent/client_config.js";
	exit 1;
fi
#building clientStudent
cd /var/www/poligon/clientStudent/ && yarn build;

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
	echo "file not found. see /var/www/poligon/clientStudent/client_config.js";
	exit 1;
fi


#deploying clientStudent
rm -rf /var/www/smartchat/clientStudent/dist;
cp -R /var/www/poligon/clientStudent/dist /var/www/smartchat/clientStudent && echo "dist successfully deployed";

#creating backup for apiStudent
apibackup='/var/www/backup/apiStudent/server'$timeStamp;
# mkdir $apibackup;
# cp -R /var/www/smartchat/apiStudent/* $apibackup && echo "server backup successfully created";

#deploying apiStudent
rm -rf /var/www/smartchat/apiStudent;
cp -R /var/www/poligon/apiStudent /var/www/smartchat && echo "student server successfully deployed";

#deploying models & functions
cd /var/www/poligon/scripts && bash modelsDeploy.sh;
cd /var/www/poligon/scripts && bash functionsDeploy.sh;

#restarting server
pm2 delete student && echo "server has stopped";
cd /var/www/smartchat/apiStudent && pm2 start student.js;


echo "Completed! check your updates https://web.smartchat.kz";