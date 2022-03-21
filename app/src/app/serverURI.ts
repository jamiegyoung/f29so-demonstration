const getServerURI = () => {
  if (process.env.NODE_ENV === 'development')
    return process.env.DEV_API_ADDRESS || 'http://localhost:7379';
  return process.env.API_ADDRESS || '';
};

export default getServerURI;
