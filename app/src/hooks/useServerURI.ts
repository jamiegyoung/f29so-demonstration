const useServerURI = () => {
  if (process.env.NODE_ENV === 'development')
    return process.env.DEV_API_ADDRESS || 'http://localhost:2000';
  return process.env.API_ADDRESS || '';
};

export default useServerURI;
