import { Dispatch } from 'redux';
import { RootState } from '..';
import { saveCells } from '../action-creators';
import { ActionType } from '../action-types';
import { Action } from '../actions';

// Redux middlewares have weird signature in that its a funtion
// returning a  function
// returnning a function
// First gets calles with store, but it's note exactly a store. It's a similar object
// We destructure dispatch from it
export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  // Timer for debouncing
  let timer: NodeJS.Timeout;

  // With next we forward the function to the next middleware.
  return (next: (action: Action) => void) => {
    // Innermost takes action we want to run this middleware for
    return (action: Action) => {
      // We put next immediately, because no matter what we want to
      // forward action to the next midleware
      next(action);

      // We check if currently dispatched action is modifying cells
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        // Debouncing logic
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(async () => {
          // Save cells is a function returning a function, that takes dispatch and getState
          // So to tun it we gave to invoke it twice, providing correct arguments.
          // (We invoke the second funtion, first one returns)
          saveCells()(dispatch, getState);
        }, 1000);
      }
    };
  };
};
