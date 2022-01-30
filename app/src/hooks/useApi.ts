import { useState } from 'react';
import { Route } from '../types';
import fetchApi from '../app/fetchApi';

const useApi = (
  route: Route,
  ...params: string[]
): [Response | null, () => Promise<void>] => {
  const [data, setData] = useState<Response | null>(null);

  const fetchData = async () => {
    setData(await fetchApi(route, ...params));
  };

  return [data, fetchData];
};

export default useApi;
