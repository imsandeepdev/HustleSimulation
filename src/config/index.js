// import axios from "axios";



export const Config = {

    API_URL: 'http://18.216.142.130/HustelAppApi/public/api/',
    BASE_URL: 'http://18.216.142.130/',

    userSignup: 'register',
    userLogin: 'login',
    currencyList: `http://18.216.142.130/HustelAppApi/public/api/user/currenciesList`,
    currencyType: 'user/chooseCurrencyType',
    forgotPassword: 'forgetpassword',
    resetPassword: 'reset_password',
    logout: 'user/logout',
    updateProfile: 'user/updateProfile',
    userProfile: 'user/profile',

}




// https://cloud.iexapis.com/stable/stock/aapl/logo?token=pk_405b3d937fc74de790767f8b159cbe52

// const Token = 'pk_405b3d937fc74de790767f8b159cbe52'

// const api = axios.create({
//   baseURL: "https://cloud.iexapis.com/stable/"
// });

// export const loadQuotesForStock = symbol => {
//   return api.get(`/stock/${symbol}/quote?token=${Token}`).then(res => res.data);
// };

// export const loadLogoForStock = symbol => {
//   return api.get(`/stock/${symbol}/logo?token=${Token}`).then(res => res.data.url);
// };

// export const loadRecentNewsForStock = symbol => {
//   return api.get(`/stock/${symbol}/news?token=${Token}`).then(res => res.data);
// };

// export const loadChartForStock = (symbol, range) => {
//   return api.get(`/stock/${symbol}/chart/${range}?token=${Token}`).then(res => res.data);
// };
