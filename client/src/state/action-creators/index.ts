import { Dispatch } from 'redux';
import bundleFunction from '../../bundler';
import { ActionType } from '../action-types';
import {
  Action,
  DeleteCellAction,
  Direction,
  InsertCellAfterAction,
  MoveCellAction,
  ToggleSharedEnvironmentCellAction,
  UpdateCellAction,
} from '../actions';
import { Cell } from '../cell';

// Cells actionCreators
export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: {
      id,
    },
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAter = (
  id: string | null,
  type: Cell['type']
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type,
    },
  };
};

export const toggleSharedEnvironmentCell = (
  id: string
): ToggleSharedEnvironmentCellAction => {
  return {
    type: ActionType.TOGGLE_SHARED_ENVIRONEMNT_CELL,
    payload: {
      id,
    },
  };
};

// Bundles actionCreators
export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    const result = await bundleFunction(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};

export const login = (userId: string, userName: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // Send request to the server with user data
    // Save recieved accessToken and load cells
  };
};
