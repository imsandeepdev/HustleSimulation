import {
    forgotpassword,
    forgotpassword_user,
    forgotpassword_error
  } from '../constants/common';
  
  const initial_state = {
    loading: false,
    forgotData: '',
    error: '',
  };
  
  const reducer = (state = initial_state, { type, payload }) => {
    switch (type) {
      case forgotpassword:
        return {
          ...state,
          loading: true,
        };
      case forgotpassword_user:
        return {
          loading: false,
          forgotData: payload,
          error: '',
        };
      case forgotpassword_error:
        return {
          loading: false,
          error: payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  