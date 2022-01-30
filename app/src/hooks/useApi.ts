import { useEffect, useState } from 'react';
import { Route } from '../types';
import fetchApi from '../app/fetchApi';

const useApi = (route: Route, ...params: string[]) => {
  const [data, setData] = useState<Response | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setData(await fetchApi(route, ...params));
    };
    fetchData();
  }, [route]);

  return data;
};

export default useApi;
