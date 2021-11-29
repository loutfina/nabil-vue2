# build this image using : docker build -t nabil/nabil-vue2 .
# check the image is created using : docker images
# start the container with this image : docker run -it -p 8080:8080 -d --name nabil-vue2 nabil/nabil-vue2
#  ==> this start on http://localhost:8080

#DockerFile start
# Choose the Image which has Node installed already
FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]