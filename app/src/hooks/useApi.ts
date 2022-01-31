import { useState } from 'react';
import { Route } from '../types';
import fetchApi from '../app/fetchApi';

const useApi = (
  route: Route,
): [Response | null, (...params: string[]) => Promise<void>] => {
  const [data, setData] = useState<Response | null>(null);

  const fetchData = async (...params: string[]) => {
    setData(await fetchApi(route, ...params));
  };

  return [data, fetchData];
};

export default useApi;
