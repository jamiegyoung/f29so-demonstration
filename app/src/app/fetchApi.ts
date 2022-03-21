import { Route } from '../types';
import getServerURI from './serverURI';

const fetchApi = (route: Route, ...params: string[]) => {
  
  if (route.params && params.length === 0) {
    throw new Error(`Params are required for this route ${route.uri}`);
  }
  
  if (!route.params && params.length > 0) {
    throw new Error(`Params are not required for this route ${route.uri}`);
  }
  const uri = `${getServerURI()}/api/${route.uri}${params.join('/')}`;
  
  return fetch(uri, route.opts);
};

export default fetchApi;