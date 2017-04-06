#change this to your own repo, should you have uploaded your image!
FROM  quasarframework/client-dev:latest

MAINTAINER Your Name <your.email@your-sites-address.com>

WORKDIR /opt/app

COPY package.json /opt/app/
RUN npm install

COPY . /opt/app

EXPOSE 8080

CMD /bin/sh
