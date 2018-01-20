import * as types from './actionTypes';

export function save_user() {
  return dispatch => {
    dispatch({
      type: types.SAVE_USER,
      user: 'temp user'
    });
  }
}