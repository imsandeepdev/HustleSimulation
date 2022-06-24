import {
    logout,
    logout_user,
    logout_error
  } from '../constants/common';
  import Api from '../services/api';
  import { Config } from '../config';
  import { Alert } from 'react-native';
  
  export const logoutUser = () => {
    return {
      type: logout,
    };
  };
  
  export const logoutUserSuccess = () => {
    return {
      type: logout_user
    };
  };
  
  export const logoutUserError = (error) => {
    return {
      type: logout_error
    };
  };
  
  
  export const userLogoutRequest = (data, success?: () => void, failed?: () => void) => {
    return (dispatch) => {
      dispatch(logoutUser());
      Api.authRequest({
        needAuth: true,
        formData: data,
        method: 'GET',
        url: Config.logout,
      })
        .then((response) => {
          dispatch(logoutUserSuccess(response));
          console.log('Logout Error', response)
          success?.(response);
        })
        .catch((error) => {
          dispatch(logoutUserError(error));
          failed?.(error);
          console.log("Error: ",error)
        });
    };
  };
  
  