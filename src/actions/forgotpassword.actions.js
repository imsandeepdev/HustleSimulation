import {
    forgotpassword,
    forgotpassword_user,
    forgotpassword_error,
} from '../constants/common';
import Api from '../services/api';
import { Config } from '../config';

export const forgotpasswordUser = () => {
    return{
        type: forgotpassword,
    };
};

export const forgotpasswordUserSuccess = (payload) => {
    return{
        type: forgotpassword_user,
        payload,
    };
};

export const forgotpasswordUserError = (error) => {
    return{
        type: forgotpassword_error,
        payload: error
    };
};

export const forgotpasswordRequest = (data, success?: () => void, failed?: () => void) => {
    return (dispatch) => {
        dispatch(forgotpasswordUser());
        Api.multipartRequest({
            needAuth: false,
            formData: data,
            url: Config.forgotPassword,
        })
        .then((response) => {
            dispatch(forgotpasswordUserSuccess(response));
            success?.(response);
            console.log("Success Registation:", response)

        })
        .catch((error) => {
            dispatch(forgotpasswordUserError(error));
            failed?.(error);
            console.log("Error Registration:", error.data)
        });
    };
};