# Image sgt911/motorcycle_management
FROM registry.fedoraproject.org/fedora:32
MAINTAINER sgt911 <sgt.911@outlook.com>

RUN echo "Updating YUM"; \
	yum update && yum upgrade -y

RUN echo "Adding Node.JS Repo"; \
	curl -sL https://rpm.nodesource.com/setup_15.x | bash - && \
	curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo
RUN echo "Installing MariaDB Depenency"; \
	curl -sLO https://download-ib01.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/b/boost169-program-options-1.69.0-4.el8.x86_64.rpm; \
	yum localinstall -y boost169-program-options-1.69.0-4.el8.x86_64.rpm; \
	rm boost169-program-options-1.69.0-4.el8.x86_64.rpm
RUN echo "Adding MariaDB Repo"; \
	echo -e "[mariadb]\nname = MariaDB\nbaseurl = http://yum.mariadb.org/10.4/fedora32-amd64\ngpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB\ngpgcheck=1" > /etc/yum.repos.d/mariadb.repo && \
	yum update

RUN echo "Installing All"; \
	yum install -y nginx python python-pip python-devel MariaDB-server nodejs yarn

RUN echo "Cleaning YUM"; \
	yum clean all

RUN echo "Installing Database"; \
	mysqld_safe --nowatch && \
	mysql_secure_installation && \
	echo "CREATE DATABASE motorcycle_management;" | mysql && \
	killall mysqld

RUN echo "Installing Python Pre-Requisites"; \
	pip install --no-cache supervisor virtualenv

COPY . /tmp/repo
WORKDIR /tmp/repo
RUN cp ./supervisord.conf /etc/.
RUN ./install.sh root

RUN cp /etc/nginx/nginx.conf{,.bak} && \
	cp /tmp/repo/docker-nginx.conf /etc/nginx/nginx.conf && \
	cp /tmp/repo/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /
EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisord.conf"]