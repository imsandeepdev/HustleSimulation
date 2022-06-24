import {
    currencytype,
    currencytype_success,
    currencytype_error,
    currencyList,
    currencyList_success,
    currencyList_error
  } from '../constants/common';
  
  const initial_state = {
    loading: false,
    currencyData:{},
    currencyList:{},
    error: '',
  };
  
  const reducer = (state = initial_state, { type, payload }) => {
    switch (type) {
      case currencytype:
        return {
          ...state,
          loading: true,
        };
      case currencytype_success:
        return {
          loading: false,
          currencyData: payload,
          error: '',
        };
      case currencytype_error:
        return {
          loading: false,
          error: payload,
        };
      case currencyList:
        return {
          ...state,
          loading: true,
        };
      case currencyList_success:
        return {
          loading: false,
          currencyList: payload,
          error: '',
        };
      case currencyList_error:
        return {
          loading: false,
          error: payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  