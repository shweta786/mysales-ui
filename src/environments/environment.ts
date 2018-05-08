// The file for the current environment will overwrite this one during build.
// Different environments can be found in ./environment.{dev|prod}.ts, and
// you can create your own and use it with the --env flag.
// The build system defaults to the dev environment.
import { Client } from '../app/shared/model/client.model';


export const environment = {
  production: false,
  //apiBaseUrl: window.location.protocol+"//"+window.location.hostname+"/data",
  apiBaseUrl: 'https://mysales.dev.phototype.com/data',
  // apiBaseUrl: 'https://mysales.uat.phototype.com/data',

  // apiBaseUrl: 'http://localhost:9100',
  version: '0.1.0',
  clients: [],
  estimateStatus: [],
  brands: {},
  unitTypes: {},
  levels: {},
  categories: {},
  components: {},
  pricings: {},
  poCategory: {}
};

export const checkMode = {
  mode: (environment.apiBaseUrl.indexOf("dev") > 0) ? "dev" :
    (environment.apiBaseUrl.indexOf("uat") > 0) ? "uat" : "prod"
}



