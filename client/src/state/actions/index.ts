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

export interface ToggleSharedEnvironmentCellAction {
  type: ActionType.TOGGLE_SHARED_ENVIRONEMNT_CELL;
  payload: {
    id: string;
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

export interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS;
  payload: {
    accessToken: string;
    userId: string;
    userName: string;
  };
}

export interface LoginFailureAction {
  type: ActionType.LOGIN_FAILURE;
  payload: {
    userId: string;
    userName: string;
  };
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction
  | ToggleSharedEnvironmentCellAction
  | LoginSuccessAction
  | LoginFailureAction;
