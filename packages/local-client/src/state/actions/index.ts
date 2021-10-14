import { Cell } from '../cell';
import { ActionType } from '../action-types';

export type Direction = 'up' | 'down';

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: Cell['id'];
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: {
    id: Cell['id'];
  };
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: Cell['id'] | null;
    type: Cell['type'];
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: Cell['id'];
    content: Cell['content'];
  };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    cellId: string;
  };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: {
    cellId: string;
    bundle: { code: string; error: string };
  };
}

// FETCHING CELLS

export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
}

export interface FetchCellsActionComplete {
  type: ActionType.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}

export interface FetchCellsActionError {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: string;
}

// SAVING CELLS
export interface SaveCellsErrorAction {
  type: ActionType.SAVE_CELLS_ERROR;
  payload: string;
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction
  | FetchCellsAction
  | FetchCellsActionComplete
  | FetchCellsActionError
  | SaveCellsErrorAction;
