# mapvue _work in progress_

> A Vue.js rewrite of MapVenture from Angular 1.x.

## Build Setup

``` bash
docker pull oscarfonts/geoserver
mkdir -p ~/geoserver-docker/data ~/geoserver-docker/extensions
docker run -d -p 8080:8080 -v ~/geoserver-docker/data:/var/local/geoserver -v ~/geoserver-docker/extensions:/var/local/geoserver-exts/ --name=geoserver oscarfonts/geoserver
```

(after a few minutes)

`http://localhost:8080/geoserver`
`export GEOSERVER_URL='http://localhost:8080/geoserver'`

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
