# mapvue

Simple OSS framework for interactive, narrative tours of geospatial data.

## Build Setup

Uses `nodejs@~8.5`, `npm@~6.4`.

### Local development

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8088
export PORT=8088
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how the project is organized and how webpack is organized, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#### Environment variables used during the build

If these variables are set in your environment, they'll be used in the application.  Default values are found in `config/dev.env.js` and `config/prod.env.js`.

 * `GEOSERVER_WMS_URL`: Geoserver WMS endpoint
 * `FIRE_FEATURES_URL`: Fire feature GeoJSON endpoint
 * `FIRE_TIME_SERIES_URL`: Fire time series GeoJSON endpoint
 * `MV_GOOGLE_ANALYTICS_TOKEN`: Google analytics token

# Deploying

```bash
cd /path/to/mapvue
# Check your enviroment variables first here
npm run build
cd dist && aws s3 sync . s3://mapventure.org
```
