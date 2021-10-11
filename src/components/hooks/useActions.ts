import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';

export const useActions = () => {
  const dispatch = useDispatch();

  // Without useMemo, new dispatch function is created on every rerender where we use it.
  // When we use some action is useEffect, it goes into an infinite loop!
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
    // Rerun useMemo when dispatch changes
    // We don't have to put actionCreators inside dependencies, becaouse
    // it's imported at the top of the file
  }, [dispatch]);
};
