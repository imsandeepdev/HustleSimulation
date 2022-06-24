import {
    signin,
    signin_user,
    signin_error,
    logout,
    logout_user,
    logout_error
  } from '../constants/common';
  
  const initial_state = {
    loading: false,
    authToken: null,
    error: '',
    loggedIn: '',
  };
  
  const reducer = (state = initial_state, { type, payload }) => {
    switch (type) {
      case signin:
        return {
          ...state,
          loading: true,
        };
      case signin_user:
        return {
          loading: false,
          authToken: payload.token,
          loggedIn: payload,
          error: '',
        };
        case signin_error:
          return {
            loading: false,
            error: payload,
          };
        case logout_user:
          return initial_state;
      default:
        return state;
    }
  };
  
  export default reducer;
  