import {
    register,
    register_user,
    register_error
  } from '../constants/common';
  
  const initial_state = {
    loading: false,
    temp_user_id: '',
    error: '',
  };
  
  const reducer = (state = initial_state, { type, payload }) => {
    switch (type) {
      case register:
        return {
          ...state,
          loading: true,
        };
      case register_user:
        return {
          loading: false,
          temp_user_id: payload.data,
          error: '',
        };
      case register_error:
        return {
          loading: false,
          error: payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  