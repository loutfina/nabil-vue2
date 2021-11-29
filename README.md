# nabil-vue2
```
Front project for project nabil-vue2 in vueJs2 using bootstrapVue.
This has been created with :
    - BoostrapVue (2.21.2 required bootstrap: "4.5.3" not bootstrap 5 !)
    - Store poccess with VueX (./src/store), 
    - Api endpoint config (./src/service/api.service and api.config), 
    - Environment (.env)
    - Authentification (./service/user.service and api.service)
    - External application config file (/public/app-config.json, main.ts and ./types/config.d.ts)
    - Mock response (/public/*-mock.json) --> mock should be deleted and replaced in api.config.ts
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Run it in docker
```
 #command line in the root folder of the project (where Dockerfile is)
 build this image using : docker build -t nabil/nabil-vue2 .
 check the image is created using : docker images
 start the container with this image : docker run -it -p 8080:8080 -d --name nabil-vue2 nabil/nabil-vue2
  ==> this start on http://localhost:8080
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
