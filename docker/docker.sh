#!/bin/sh

version=2023
serviceName=nginx-temples
targetTagName=$serviceName:$version

echo "begin to build image"
echo "[exec]: docker build -t $targetTagName -f Dockerfile ."
# docker build --platform linux/amd64 -t $targetTagName .
docker build --platform linux/arm64/v8 -t $targetTagName .
docker stop nginx-temples

docker rm nginx-temples 

docker run -d --restart=always --name nginx-temples -p 8000:80 -p 443:443 $serviceName:$version

docker start nginx-temples

docker logs --tail=100 nginx-temples
