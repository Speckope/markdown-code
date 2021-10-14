import produce from 'immer';
import { Cell } from '../cell';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellReducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        // With immer, we can modify the state directly without returning
        state.data[id].content = content;
        return state;

      case ActionType.DELETE_CELL:
        // Simple delete Cell from data
        delete state.data[action.payload.id];
        // Assign new order to state.order
        state.order = state.order.filter((id) => id !== action.payload.id);
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        // Find index of cell we want to move
        const index = state.order.findIndex((id) => id === action.payload.id);
        // Get new index of an element
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // If desired position is outside of an array return early, it's an invalid update.
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        // Swap ids
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId(),
        };

        state.data[cell.id] = cell;

        // Index of cell we want to place new cell before
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        // If index is null, it means we insert new cell at the end.
        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          // Insert new id into cell
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;

      // ACTIONS FOR FETCHING
      case ActionType.FETCH_CELLS:
        state.loading = true;
        // set error to null. It's useful if there was some error with previous fetching
        state.error = null;
        return state;

      case ActionType.FETCH_CELLS_COMPLETE:
        state.loading = false;
        // Get correct order of cells.
        state.order = action.payload.map((cell) => cell.id);
        // Iterate over every value in an array with reduce and add id to it.
        // We make new object, creating inside pair with cell.id as key,
        // then setting value as cell.
        // Reduce then returns it and we add next cell to it until array is done.
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
          // Tell TS what type of object it is, othwerwise we get an error (type assertion)
        }, {} as CellsState['data']);

        return state;

      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;

      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;

      default:
        return state;
    }
  },
  initialState
);

const randomId = () => {
  // Generate random number, convert to string with base36, take only a portion of it.
  return Math.random().toString(36).substring(2, 7);
};

export default cellReducer;
