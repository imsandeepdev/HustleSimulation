import {
    user_profile,
    user_profile_success,
    user_profile_error,
    user_update_profile,
    user_update_profile_success,
    user_update_profile_error,
} from '../constants/common';
import api from '../services/api';
import { Config } from '../config';

export const profileUser = () => {
    return{
        type: user_profile,
    };
};

export const profileUserSuccess = payload => {
    return {
        type: user_profile_success,
        payload,
    };
};

export const profileUserError = error => {
    return {
        type: user_profile_error,
        error,
    };
};

export const UpdateUserProfile = () => {
    return{
        type: user_update_profile,
    };
};

export const UpdateUserProfileSuccess = payload => {
    return {
        type: user_update_profile_success,
        payload,
    };
};

export const UpdateUserProfileError = error => {
    return {
        type: user_update_profile_error,
        error,
    };
};


export const userProfileRequest = (
    data,
    success?:  () => void,
    failed?: () => void,
) =>{
    return dispacth => {
        dispacth(profileUser());
        api.multipartRequestForGet({ 
            url: Config.userProfile,
        })
        .then(response => {
            console.log('Success Profile', response);
            dispacth(profileUserSuccess(response));
            success?.(response);
        })
        .catch(error => {
            dispacth(profileUserError(error));
            failed?.(error);
            console.log('Error', error);
        });
    };
};


export const userUpdateProfileRequest = (
    data,
    success?:  () => void,
    failed?: () => void,
) =>{
    return dispacth => {
        dispacth(UpdateUserProfile());
        api.multipartRequest({
            needAuth: true,
            formData: data,
            url: Config.updateProfile,
        })
        .then(response => {
            dispacth(UpdateUserProfileSuccess(response));
            success?.(response);
        })
        .catch(error => {
            dispacth(UpdateUserProfileError(error));
            failed?.(error);
            console.log('Error', error);
        });
    };
};