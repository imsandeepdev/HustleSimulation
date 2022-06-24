import {
    signin,
    signin_user,
    signin_error,
    logout,
    logout_user,
    logout_error
  } from '../constants/common';
  import Api from '../services/api';
  import { Config } from '../config';
  import { Alert } from 'react-native';
  
  export const signInUser = () => {
    return {
      type: signin,
    };
  };
  
  export const signeInUserSuccess = (payload) => {
    return {
      type: signin_user,
      payload,
    };
  };
  
  export const signeInUserError = (error) => {
    return {
      type: signin_error,
      payload: error,
    };
  };

  export const logoutUserSuccess = () => {
    return {
      type: logout_user,
    };
  };
  
  
  export const userSignInRequest = (data, success?: () => void, failed?: () => void) => {
    return (dispatch) => {
      dispatch(signInUser());
      Api.multipartRequest({
        needAuth: false,
        formData: data,
        url: Config.userLogin,
      })
        .then((response) => {
          dispatch(signeInUserSuccess(response));
          console.log('login', response.token)
          success?.(response);
        })
        .catch((error) => {
          dispatch(signeInUserError(error));
          failed?.(error);
          console.log("Error: ",error)
        });
    };
  };
  
  export const userSignOutRequest = () => {
    return (dispatch) => {
      
      dispatch(logoutUserSuccess());
    
  
    };
  };
  