FROM node:alpine
RUN apk add python make g++
COPY "." "/home/node/app"
RUN cd /home/node/app && npm install --production
ENV PORT=3000
ENV dbURL="mongodb://mongo:27017/kok_db"
ENV db_user=mongo
ENV db_pass=mongo
CMD ["/home/node/app/bin/www"]