import { useState } from 'react';
import { FetchOpts, Route } from '../types';
import fetchApi from '../app/fetchApi';

const useApi = (
  route: Route,
): [Response | null, (fetchOpts?: FetchOpts) => Promise<void>] => {
  const [data, setData] = useState<Response | null>(null);

  const fetchData = async (fetchOpts?: FetchOpts) => {
    setData(await fetchApi(route, fetchOpts));
  };

  return [data, fetchData];
};

export default useApi;
