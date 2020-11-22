# UAES Code Carnival Project Frontend

## Steps to build docker image from scratch

1. intall docker and start

```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

Add user to docker group if you don't want to start the image with root privilege

```
sudo usermod -aG docker <user_name>
```

start docker service

```
sudo service docker start
```

2. pull ubuntu docker image and start the terminal in the image

```
docker pull ubuntu:latest
docker run -i -t ubuntu:latest /bin/bash
```

The following command is executed in the docker image

3. install text editor (nano, vi, vim ...) and change apt source list

4. install curl and git

5. install node.js (version: V15.x.x)

```
curl -sL https://deb.nodesource.com/setup_15.x > node.sh
chmod +x node.sh
./node.sh
apt-get install -y nodejs
node -v
```

6. install yarn and tyarn (optional if you use tyarn for package manager)
```
npm config set registry https://registry.npm.taobao.org
npm install yarn tyarn -g
yarn -v
```

7. install ant-design-pro
```
npm create umi
```
then select 'ant-design-pro'
then select 'Pro V'

8. start the project

```
npm install
npm start
```


