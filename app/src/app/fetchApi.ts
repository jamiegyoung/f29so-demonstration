import { Route, FetchOpts } from '../types';

const fetchApi: (
  route: Route,
  fetchOpts?: FetchOpts | undefined,
) => Promise<Response> = (route: Route, fetchOpts?: FetchOpts) => {
  if (fetchOpts === undefined) return fetch(`/${route.uri}`, route.opts);
  if (!route) {
    throw new Error('Route is not defined');
  }
  if (route.params && !fetchOpts.params) {
    throw new Error(`Params are required for this route ${route.uri}`);
  }

  if (!route.params && fetchOpts.params) {
    throw new Error(`Params are not required for this route ${route.uri}`);
  }

  const uri = () =>
    fetchOpts.params
      ? `/${route.uri}/${fetchOpts.params.join('/')}`
      : `/${route.uri}`;

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
