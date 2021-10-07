import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';

const reducers = combineReducers({
  cells: cellsReducer,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
