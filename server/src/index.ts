import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('Hi There! Good Luck getting it all together! Work well ;)');
});

app.listen(4000, () => {
  console.log('Listening on 4000...');
});
