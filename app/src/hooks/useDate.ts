const useDate = (date: number) =>
  new Date(date * 1000).toLocaleString().split(',')[0].replaceAll('/', '-');

export default useDate;
