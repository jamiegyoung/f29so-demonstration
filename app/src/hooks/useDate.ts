function useDate(date: number) {
  return new Date(date * 1000).toLocaleString().split(',')[0];
}

export default useDate;
