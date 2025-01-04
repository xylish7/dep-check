export const isExternalUrl = (url: string) => {
  return url.indexOf("http://") === 0 || url.indexOf("https://") === 0;
};
