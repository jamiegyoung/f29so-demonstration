import { useEffect, useState } from 'react';
import { Route } from '../types';
import useServerURI from './useServerURI';

const useApi = (route: Route, ...params: string[]) => {
  if (route.params && params.length === 0) {
    throw new Error(`Params are required for this route ${route.uri}`);
  }

  if (!route.params && params.length > 0) {
    throw new Error(`Params are not required for this route ${route.uri}`);
  }

  const uri = `${useServerURI()}/api/${route.uri}${params}`;

  const [data, setData] = useState<Response | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setData(await fetch(uri, route.opts));
    };
    fetchData();
  }, [route]);

  return data;
};

export default useApi;
