import 'reflect-metadata';
import { createConnection, getMongoManager } from 'typeorm';
import express from 'express';
import { Cell } from './entities/Cell';
import { cellsRouter } from './routes/cells';

const main = async () => {
  const connection = await createConnection({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'test',
    entities: [Cell],
    useUnifiedTopology: true,
  }).catch((err) => console.log(err));
  if (!connection) throw Error('No connection');

  console.log('Is connected: ' + connection.isConnected);

  const codeCell = new Cell();
  codeCell.content = 'console.log(1)';
  codeCell.type = 'text';
  codeCell.sharedEnvironment = true;
  // Save
  const manager = getMongoManager();
  await manager.save(codeCell);

  const app = express();

  app.use(cellsRouter);

  app.get('/', (_req, res) => {
    res.send('Hi There! Good Luck getting it all together! Work well ;)');
  });

  app.listen(4000, () => {
    console.log('Listening on 4000...');
  });
};

main();
