#!/bin/sh

version=20231023.6
serviceName=registry.cn-hangzhou.aliyuncs.com/touchbiz/nginx-temples
targetTagName=$serviceName:$version

echo "begin to build image"
echo "[exec]: docker build -t $targetTagName -f Dockerfile ."
docker build --platform linux/amd64 -t $targetTagName .
docker push $targetTagName
