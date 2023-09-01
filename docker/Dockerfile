FROM nginx

ENV LANG en_US.UTF-8

VOLUME /tmp

COPY cert/touchbiz.tech.pem /etc/nginx/ssl/
COPY cert/touchbiz.tech.key /etc/nginx/ssl/


COPY conf/default.conf /etc/nginx/conf.d/default.conf

# COPY conf/nginx.conf /etc/nginx/conf.d/nginx.conf

ADD dist/ /var/www/html/

EXPOSE 80
EXPOSE 443

