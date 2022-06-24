import {
    user_profile,
    user_profile_success,
    user_profile_error,
    user_update_profile,
    user_update_profile_success,
    user_update_profile_error,
} from '../constants/common';

const initial_state = {
    loading: false,
    user: null,
    error: '',
};

const reducer = (state= initial_state, {type, payload}) => {
    switch (type) {
        case user_profile:
            return{
                ...state,
                loading: true,
            };
        case user_profile_success:
            return{
                loading: false,
                user: payload,
                error: '',
            };
        case user_profile_error:
            return{
                ...state,
                loading: false,
                error: payload,
            };
        case user_update_profile:
            return{
                ...state,
                loading: true,
            };
        case user_update_profile_success:
            return{
                ...state,
                loading: false,
                error: '',
            };
        case user_update_profile_error:
            return{
                ...state,
                loading: false,
                error: payload,
            };
        default:
            return state;
    }
};

export default reducer;