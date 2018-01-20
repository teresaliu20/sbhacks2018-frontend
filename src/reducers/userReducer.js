import { SAVE_USER } from '../actions/actionTypes';

export default function user(state = {}, action) {
  let newState;
  switch (action.type) {
    case SAVE_USER:
      console.log('SAVE_USER Action')
      return action.user;
    default:
      return state;
  }
}