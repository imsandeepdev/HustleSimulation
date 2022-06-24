import { toggleLoader } from '../actions/common.actions';
import { store } from '../store';
import { Config } from '../config';
import Toast from 'react-native-simple-toast';
import { Alert } from 'react-native';

const authRequest = ({ url, method, body, hideLoader = false, skipSuccess }) =>
  new Promise((resolve, reject) => {
    const {
      auth: { authToken },
    } = store.getState();
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const loader = url;

    const configForPost = {
      method,
      headers,
      body: JSON.stringify(body),
    };

    const configForGet = {
      method,
      headers,
    };

    const requestUrl = Config.API_URL + url;

    const config = method === 'POST' ? configForPost : configForGet;

    console.log("Print ==> ", config, " ==> ", requestUrl)
    
    store.dispatch(toggleLoader({ action: 'start', loader, hideLoader }));
    fetch(requestUrl, config)
      .then((response) => response.json())
      .then((responseJson) => {

        resolve(responseJson);

        // const { success, message } = responseJson;

        // if (success || (!success && skipSuccess)) {
        //   resolve(responseJson);
        // } else {
        //   Toast.show(message, Toast.SHORT);
        //   reject(responseJson);
        // }
      })
      .catch((error) => {
        console.log('Error Value', error);
        reject(error);

      });
  });


  
const request = ({ url, method, body, hideLoader = false }) =>
  new Promise((resolve, reject) => {
    const loader = url;

    // const configForPost = {
    //   method,
    //   body: JSON.stringify(body),
    // };

    const configForGet = {
      method: 'GET'
    };

    const config =  configForGet;
    
    const requestUrl = Config.API_URL + url;

    console.log("Print ==> ", configForPost, " ==> ", requestUrl)

    store.dispatch(toggleLoader({ action: 'start', loader, hideLoader }));

    fetch(requestUrl, config)
      .then(response => response.json())
      .then(responseJson => {

        resolve(responseJson);
        // const { success, message } = responseJson;
        // if (success) {
        //   resolve(responseJson);
        // } else {
        //   Toast.show(message, Toast.SHORT);
        //   reject(responseJson);
        // }
      })
      .catch((error) => {
        console.log('Error Value', error);
        reject(error);

      });
  });


  
  const multipartRequest = ({ url, needAuth, formData, hideLoader = false }) =>
  new Promise((resolve, reject) => {
    const {
      auth: { authToken },
    } = store.getState();
    const loader = url;
    const headerForAuth = {
      "Accept": "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${authToken}`,
    };
    const headerWithoutAuth = {
      "Accept": "application/json",
      "Content-Type": "multipart/form-data",
    };
    const headers = needAuth ? headerForAuth : headerWithoutAuth;
    const config = {
      method: 'POST',
      headers,
      body: formData,
    };
    const requestUrl = Config.API_URL + url;

    console.log("Request params ==> ", formData, " ==> ", requestUrl)

    store.dispatch(toggleLoader({ action: 'start', loader, hideLoader }));

    fetch(requestUrl, config)
      .then(response => response.json())
      .then(responseJson => {

        resolve(responseJson);

        //  if(responseJson.status===200)
        //  {
        //   console.log('ResponseJSON value',responseJson);
        //   resolve(responseJson);

        //  } else {
        //   console.log('Error value',responseJson);

        //   // const message=(responseJson.email).toString();
        //   Toast.show(responseJson.message, Toast.SHORT)

        //  }

        // const { success, message, status_code } = responseJson;
        // if (success) {
        //   console.log('Mew value',responseJson);
        //   resolve(responseJson);
        // } else {
        //   console.log('else value',responseJson);
        //   Toast.show(message, Toast.SHORT);
        //   reject(responseJson);
        // }
      })
      .catch((error)=>{
        console.log('Catch Error Message in API Services',error.message);
        reject(error);
      })
      // .catch((error) => {
      //   reject(error);
      //   if(error.message === 'Network request failed')
      //     Toast.show('Check Internet Connection', Toast.SHORT)
      //   store.dispatch(toggleLoader({ action: 'stop', loader }));
      // });
  });

  const getRequest = ({url, needAuth, formData, hideLoader = false}) => 
  new Promise ((resolve, reject) => {
    const {
      auth: {authToken},
    } = store.getState();
    const loader = url;

    const requestUrl = Config.API_URL + url;
    fetch(requestUrl)
    .then(response => response.json())
    .then(responseJson => {
      resolve(responseJson)
    })
    .catch((error)=>{
      console.log('Error Massage',error.message);
      reject(error);
    })

  })


  const multipartRequestForGet = ({ url }) =>
  new Promise((resolve, reject) => {
    const {
      auth: { authToken },
    } = store.getState();
    const headerForAuth = {
      'Accept': "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method:'GET',
      headerForAuth
    };
    const requestUrl = Config.API_URL + url;

    console.log("Request params ==> ", config, " ==> ", requestUrl)

    fetch(requestUrl, url)
      .then(response => response.json())
      .then(responseJson => {
        console.log('Profile Data', responseJson);
        resolve(responseJson);

      })
      .catch((error)=>{
        console.log('Catch Error Message in API Services',error.message);
        reject(error);
      })
  });

export default { request, authRequest, multipartRequest , getRequest,multipartRequestForGet};
