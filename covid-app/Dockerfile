FROM mizzouceri/tomcat-mvn-java11:latest
MAINTAINER Songjie Wang "wangso@missouri.edu"

RUN apt-get -y update && apt-get -y install lsb-release && apt-get install net-tools nano
RUN apt-get -y install default-mysql-server maven
WORKDIR /root 
ADD Covid19-website /root/Covid19-website
WORKDIR /root/Covid19-website
RUN mvn clean package
RUN cp /root/Covid19-website/target/*.war /usr/local/tomcat/webapp/Covid-19.war

