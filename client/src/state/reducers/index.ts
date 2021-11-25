import { combineReducers } from 'redux';
import bundlesReducer from './bundlesReducer';
import cellsReducer from './cellsReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
