FROM php:7.2-apache

ENV HTML /var/www/html
COPY source $HTML

RUN apt-get update && \
    apt-get install -y gnupg curl && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

RUN cd $HTML && \
    npm install && \
    npm install angular-local-storage && \
    npm install -g grunt-cli && \
    grunt
