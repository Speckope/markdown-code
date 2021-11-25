import { ActionType } from '../action-types';
import { Action } from '../actions';

interface UserState {
  userId: string;
  userName: string;
  accessToken: string;
}

const initialState: UserState = {
  userId: '',
  userName: '',
  accessToken: '',
};

const userReducer = (
  state: UserState = initialState,
  action: Action
): UserState => {
  switch (action.type) {
    case ActionType.LOGIN_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
