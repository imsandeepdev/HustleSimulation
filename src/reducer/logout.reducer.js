import {
    logout,
    logout_user,
    logout_error
  } from '../constants/common';
  
  const initial_state = {
    loading: false,
    authToken: null,
    loggedIn: '',
    error: '',
  };
  
  const reducer = (state = initial_state, { type, payload }) => {
    switch (type) {
      case logout:
        return {
          ...state,
          loading: true,
        };
      case logout_user:
        return initial_state;
      case logout_error:
        return {
          loading: false,
          error: payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  