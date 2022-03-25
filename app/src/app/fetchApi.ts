import { Route, FetchOpts } from '../types';
import getServerURI from './serverURI';

const fetchApi: (
  route: Route,
  fetchOpts?: FetchOpts | undefined,
) => Promise<Response> = (route: Route, fetchOpts?: FetchOpts) => {
  if (!fetchOpts) return fetch(`${getServerURI()}${route.uri}`, route.opts);

  if (route.params && !fetchOpts.params) {
    throw new Error(`Params are required for this route ${route.uri}`);
  }

  if (!route.params && fetchOpts.params) {
    throw new Error(`Params are not required for this route ${route.uri}`);
  }

  const uri = () =>
    fetchOpts.params
      ? `${getServerURI()}/${route.uri}${fetchOpts.params.join('/')}`
      : `${getServerURI()}/${route.uri}`;

  if (!route.body) return fetch(uri(), route.opts);

  const opts: () => RequestInit = () => {
    if (typeof fetchOpts.body === 'object') {
      return { ...route.opts, body: JSON.stringify(fetchOpts.body) };
    }
    return { ...route.opts, body: fetchOpts.body };
  };

  return fetch(uri(), opts());
};

export default fetchApi;
