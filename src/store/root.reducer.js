import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';

import authReducer from '../reducer/auth.reducer';
import register from '../reducer/register.reducer';
import forgotPassword from '../reducer/forgotpassword.reducer';
import currencyType from '../reducer/currencytype.reducer';
import LogoutUser from '../reducer/logout.reducer';
import UserProfile from '../reducer/userProfile.reducer'

const authPersistConfig = {
    storage: AsyncStorage,
    key: 'auth',
}

export default combineReducers({
    register,
    auth: persistReducer(authPersistConfig, authReducer),
    forgotPassword,
    currencyType,
    LogoutUser,
    UserProfile
});