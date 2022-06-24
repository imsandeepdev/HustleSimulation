import {
    register,
    register_user,
    register_error
} from '../constants/common';
import Api from '../services/api';
import { Config } from '../config';
import { Alert } from 'react-native';

export const registerUser = () => {
    return{
        type: register,
    };
};

export const registerUserSuccess = (payload) => {
    return{
        type: register_user,
        payload,
    };
};

export const registerUserError = (error) => {
    return{
        type: register_error,
        payload: error
    };
};

export const userRegisterRequest = (data, success?: () => void, failed?: () => void) => {
    return (dispatch) => {
        dispatch(registerUser());
        Api.multipartRequest({
            needAuth: false,
            formData: data,
            url: Config.userSignup,
        })
        .then((response) => {
            dispatch(registerUserSuccess(response));
            success?.(response);
            console.log("Success Registation:", response)

        })
        .catch((error) => {
            dispatch(registerUserError(error));
            failed?.(error);
            console.log("Error Registration:", error)
        });
    };
};