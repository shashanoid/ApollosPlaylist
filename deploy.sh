#!/bin/bash

echo "Copying files to production"

sudo cp -r -f apollos-playlist/* ./production/

echo "Making production build for frontend"
cd ~/myproject/production/react-web-client

npm install; npm run build

echo "Build Complete"

cd ~/myproject/production/api/

echo "Copying frontend production build to flask server"

rm -r  templates
rm -r static

mkdir templates
mkdir static

cp -r ~/myproject/production/react-web-client/build/* ~/myproject/production/api/templates/
cp -r ~/myproject/production/api/templates/static/* ~/myproject/production/api/static/

echo "Done"

echo "Restarting services"
sudo systemctl stop myproject
sudo service nginx restart
sudo systemctl start myproject

echo "Service health -> sudo systemctl status myproject"