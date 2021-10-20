import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';

const main = async () => {
  const connection = await createConnection({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'test',
    useUnifiedTopology: true,
  }).catch((err) => console.log(err));
  if (!connection) throw Error('No connection');

  console.log('Is connected: ' + connection.isConnected);

  const app = express();

  app.get('/', (_req, res) => {
    res.send('Hi There! Good Luck getting it all together! Work well ;)');
  });

  app.listen(4000, () => {
    console.log('Listening on 4000...');
  });
};

main();
