import {config as conf} from './api.config';

class ApiService {

  rootPath!: string;
  conf:any;

  constructor() {
    this._init();
  }

  async get(key:any, params:any={}, config={}, useCache=true, isJson=true) {
    const endpoint  = this.conf.endpoints[key];

    let sessionKey = this.conf.sessionPrefix ? this.conf.sessionPrefix  + '-' : '';
    sessionKey += params.id ? key + '-' + params.id : key;

    const inSession  = endpoint.isCached && useCache && this._getSession(sessionKey);
    if (inSession) {
      return inSession;
    }

    const path   = this._endpointPath(endpoint, params);
    const result = await fetch(path, this._addAuthHeader({ method: 'GET', ...config}));
 
    if (result.status > 200) {
      throw result;
    }
    const value  = isJson ? result.json() : result;
    
    if (endpoint.isCached) {
      this._setSession(sessionKey, value);
    }
    return value;
  }

  async post(key:any, params={}, body:any, config:any) {
    const endpoint  = this.conf.endpoints[key];

    const path   = this._endpointPath(endpoint, params);
    const result = await fetch(path, this._addAuthHeader({ method: 'POST', body, ...config}));

    return result.json();
  }

  async put(key:any, params={}, body:any, config:any) {
    const endpoint  = this.conf.endpoints[key];

    const path   = this._endpointPath(endpoint, params);
    const result = await fetch(path, this._addAuthHeader({ method: 'PUT', body, ...config}));

    return result.json();
  }

  async delete(key:any, params={}) {
    const endpoint  = this.conf.endpoints[key];

    const path   = this._endpointPath(endpoint, params);
    const result = await fetch(path, this._addAuthHeader({ method: 'DELETE'}));

    return result.json();
  }

  _init() {
    this.conf = conf;
    this.rootPath = process.env.VUE_APP_ROOT_API.replace(new RegExp('/$'), '');
    if (!this.rootPath) {
      throw 'Unable to set the API root path :'+ JSON.stringify(process.env);
    }
  }

  _endpointPath(endpoint:any, params:any) {
    const paramsKeys  = Object.keys(params);
    const queryParams:Array<string> = [];
    let   path        = endpoint.path;

    paramsKeys.forEach(key => {
      const value  = params[key];
      const regExp = new RegExp(':' + key + '?(?=/|$)');

      if (regExp.test(path) && value) {
        path = path.replace(regExp, value);

      } else if (regExp.test(path)) {
        const regExpWithSlash = new RegExp('/:' + key + '?(?=/|$)');
        path = path.replace(regExpWithSlash, '');
        
      } else {
        queryParams.push(key + '=' + value);
      }
    });

    let finalPath = this.rootPath + '/' + path;
    if (queryParams.length) {
      finalPath += '?' + queryParams.join('&');
    }

    return finalPath;
  }

  _getSession(key:any) {
    const encoded = sessionStorage.getItem(key) || false;
    return encoded && JSON.parse(encoded);
  }

  _setSession(key:any, value:any) {
    const encoded = JSON.stringify(value);
    return sessionStorage.setItem(key, encoded);
  }

  _addAuthHeader(fetchOptions:any) {
    // return authorization header with jwt token
    const user:any = JSON.parse( sessionStorage.getItem("nabil-user") || '' );

    if (user && user.token) {
      const headers = fetchOptions && fetchOptions.headers ? fetchOptions.headers : {};
      headers.Authorization = 'Bearer ' + user.token;
      fetchOptions.headers = headers;
    }
    return fetchOptions;
  }
}

const apiService = new ApiService();
export default apiService;