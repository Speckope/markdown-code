export const serve = (port: number, filename: string, dir: string) => {
  console.log('Serving on: ', port);
  console.log('Saving/fetching cells from: ', filename);
  console.log('That file is in directory ', dir);
};
