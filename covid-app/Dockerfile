FROM tomcat:8.5.54
MAINTAINER Songjie Wang "wangso@missouri.edu"

RUN apt-get -y update && apt-get -y install lsb-release && apt-get install net-tools nano
RUN apt-get -y install default-mysql-server maven
WORKDIR /root 
ADD Covid19-website /root/Covid19-website
# COPY ./*.war /usr/local/tomcat/webapps/