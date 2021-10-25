import express from 'express';
import { Cell } from '../entities/Cell';
import { getMongoManager } from 'typeorm';

const router = express.Router();

router.use(express.json());

// SAVING A NEW CELL
router.post('/cells', async (req, res) => {
  try {
    const cellRepository = getMongoManager().getRepository(Cell);
    // Get data from body
    const { cell }: { cell: Cell } = req.body;

    const newCell = await cellRepository.save(cell);

    console.log(newCell);

    // Send back created cell and ok
    res.status(200).json({
      status: 'success',
      data: {
        cell: newCell,
      },
    });
  } catch (err: any) {
    console.log(err.message);
  }
});

// UPDATING A CELL
router.put('/cells', async (req, res) => {
  try {
    const cellRepository = getMongoManager().getRepository(Cell);
    // Get data from body
    const { cell }: { cell: Cell } = req.body;
    // Update a cell
    await cellRepository.update(cell.id, cell);

    res.sendStatus(200);
  } catch (err: any) {
    console.log(err.message);
  }
});

// DELETING A CELL
router.delete('/cells', async (req, res) => {
  try {
    const cellRepository = getMongoManager().getRepository(Cell);

    const { id } = req.body;
    console.log(id);

    await cellRepository.delete(id);

    res.sendStatus(200);
  } catch (err: any) {
    console.log(err);
  }
});

// GETTING ALL CELLS
router.get('/cells', async (_req, res) => {
  try {
    const cellRepository = getMongoManager().getRepository(Cell);

    const cells = await cellRepository.find();
    console.log(cells);

    res.status(200).json({
      data: cells,
    });
  } catch (err) {
    console.log(err);
  }
});

export { router as cellsRouter };
