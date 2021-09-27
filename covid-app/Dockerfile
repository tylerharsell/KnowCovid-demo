FROM tomcat:latest
MAINTAINER Songjie Wang "wangso@missouri.edu"

RUN apt-get -y update && apt-get -y install lsb-release && apt-get install net-tools nano
RUN apt-get -y install default-mysql-server
WORKDIR /root 
ADD Covid19-website /root/Covid19-website
# COPY ./*.war /usr/local/tomcat/webapps/