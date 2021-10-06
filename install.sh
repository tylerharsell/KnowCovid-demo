#!/bin/bash

# install Docker and docker compose
sudo su
apt-get -y update
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER
apt-get -y install docker-compose 

# install Java 11
apt-get update
apt -y install openjdk-11-jdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# install Jenkins
cd /usr/local/
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > \
    /etc/apt/sources.list.d/jenkins.list'
apt-get -y update
apt-get -y install jenkins
systemctl daemon-reload
systemctl start jenkins
systemctl status jenkins

# install maven 
cd /usr/local
wget https://apache.osuosl.org/maven/maven-3/3.8.3/binaries/apache-maven-3.8.3-bin.zip
apt-get -y install unzip
unzip apache-maven-3.8.3-bin.zip

# adding environment variables into system
echo "  export PATH=/usr/local/apache-maven-3.8.3/bin:$PATH
  export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" | tee -a ~/.bashrc 
source ~/.bashrc

# install Tomcat
cd /usr/local
wget https://dlcdn.apache.org/tomcat/tomcat-10/v10.0.12/bin/apache-tomcat-10.0.12.tar.gz
tar -xzvf apache-tomcat-10.0.12.tar.gz 
mv apache-tomcat-10.0.12 tomcat

# retrieve Jenkins password
cat /var/lib/jenkins/secrets/initialAdminPassword