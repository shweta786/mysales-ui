export const environment = {
  production: false,
  // apiBaseUrl: "http://localhost:9100",

  apiBaseUrl: 'https://mysales.dev.phototype.com/data',
  // apiBaseUrl: window.location.protocol+"//"+window.location.hostname+"/data",
  version: '0.3.0',
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
