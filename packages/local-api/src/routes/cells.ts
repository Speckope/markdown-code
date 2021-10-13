import express from 'express';
import path from 'path';
// /promises is the same module as fs, but instead of callbacks, it uses promises.
// This alllows us to write async await code.
import fs from 'fs/promises';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  // body parsing middleware
  router.use(express.json);

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf8' });
      // Parse a list of cells out of the file and send list of cells back to the browser
      res.send(JSON.parse(result));
    } catch (err: any) {
      // ENOENT mneans the file doesn't exist. (error no entity)
      if (err.code === 'ENOENT') {
        // Create a file and add default cells
        await fs.writeFile(fullPath, '[]', 'utf8');
        res.send([]);
      } else {
        throw err;
      }
    }

    // If read throws an error,
    // Inspect error and see if file doesn't exist
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from req object
    // Serialize them
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file
    // fullPath is where we write this file, 2nd argument is content(stringified array of cells)
    // 3d is how it will be encoded.
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });
  return router;
};
