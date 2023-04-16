FROM mysql:8.0
ENV LANG ja_JP.UTF-8
ENV TZ=Asia/Tokyo

COPY ./my.conf /etc/mysql/conf.d/my.conf
COPY init.sql /docker-entrypoint-initdb.d/

CMD [ "mysqld", "--character-set-server=utf8", "--collation-server=utf8_unicode_ci" ]  