import {
        currencytype,
        currencytype_success,
        currencytype_error,
        currencyList,
        currencyList_success,
        currencyList_error
} from '../constants/common';
import Api from '../services/api';
import { Config } from '../config';

export const currencyType = () => {
    return{
        type: currencytype,
    };
};

export const currencyTypeSuccess = (payload) => {
    return{
        type: currencytype_success,
        payload,
    };
};

export const currencyTypeError = (error) => {
    return{
        type: currencytype_error,
        payload: error
    };
};
export const allCurrencyList = () => {
    return{
        type: currencyList,
    };
};

export const allCurrencyListSuccess = (payload) => {
    return{
        type: currencyList_success,
        payload,
    };
};

export const allCurrencyListError = (error) => {
    return{
        type: currencyList_error,
        payload: error
    };
};

export const currencyListRequest = (data, success?: () => void, failed?: () => void) => {
    return (dispatch) => {
        dispatch(allCurrencyList());
        Api.multipartRequestForGet({
            needAuth: false,
            formData: data,
            url: Config.currencyList,
        })
        .then((response) => {
            dispatch(allCurrencyListSuccess(response));
            success?.(response);
            console.log("Success Value:", response)

        })
        .catch((error) => {
            dispatch(allCurrencyListError(error));
            failed?.(error);
            console.log("Error Value:", error.data)
        });
    };
};


export const currencyTypeRequest = (data, success?: () => void, failed?: () => void) => {
    return (dispatch) => {
        dispatch(currencyType());
        Api.multipartRequest({
            needAuth: false,
            formData: data,
            url: Config.currencyType,
        })
        .then((response) => {
            dispatch(currencyTypeSuccess(response));
            success?.(response);
            console.log("Success Value:", response)

        })
        .catch((error) => {
            dispatch(currencyTypeError(error));
            failed?.(error);
            console.log("Error Value:", error.data)
        });
    };
};