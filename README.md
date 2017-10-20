# mapvue _work in progress_

> A Vue.js rewrite of MapVenture from Angular 1.x.

## Build Setup

### Web application

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#### Environment variables used during the build

If these variables are set in your environment, they'll be used in the application.  Default values are found in `config/dev.env.js` and `config/prod.env.js`.

 * `GEOSERVER_WMS_URL`: Geoserver WMS endpoint
 * `FIRE_FEATURES_URL`: Fire feature GeoJSON endpoint
 * `FIRE_TIME_SERIES_URL`: Fire time series GeoJSON endpoint
 * `MV_GOOGLE_ANALYTICS_TOKEN`: Google analytics token

### Geoserver instance for local development

``` bash
docker pull oscarfonts/geoserver
mkdir -p ~/geoserver-docker/data ~/geoserver-docker/extensions
docker run -d -p 8080:8080 -v ~/geoserver-docker/data:/var/local/geoserver -v ~/geoserver-docker/extensions:/var/local/geoserver-exts/ --name=geoserver oscarfonts/geoserver
```

(after a few minutes)

`http://localhost:8080/geoserver`
`export GEOSERVER_URL='http://localhost:8080/geoserver'`
