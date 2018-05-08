export const environment = {
  production: true,
  apiBaseUrl: window.location.protocol + "//" + window.location.hostname + "/data",
  version: '0.2.0',
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
