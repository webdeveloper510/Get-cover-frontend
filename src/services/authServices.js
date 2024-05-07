// services/authService.js
import axios from "axios";

//delacring the base url of the api
const url = process.env.REACT_APP_API_KEY_LOCAL
// const url =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_KEY_PROD
//     : process.env.REACT_APP_API_KEY_LOCAL;
console.log(url)
//api calls
export const authlogin = async (loginDetails) => {
  try {
    const response = await axios.post(`${url}/user/login`, loginDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAccessToken = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  return userDetails ? userDetails.token : null;
};

const createHeaders = () => {
  const accessToken = getAccessToken();

  if (accessToken) {
    return {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    };
  }
};

export const apiUrl = () => {
  const headers = createHeaders();
  const urlValue = new URL(url);

  return {
    baseUrl: urlValue.origin,
    headers: headers
  };
};


export const authDealerRegister = async (dealerRegisterData) => {
  try {
    const response = await axios.post(
      `${url}/dealer/register`,
      dealerRegisterData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authserviceProviderRegister = async (
  serviceProviderRegisterData
) => {
  try {
    const response = await axios.post(
      `${url}/servicer/register`,
      serviceProviderRegisterData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendResetPasswordLink = async (resetPasswordLinkData) => {
  try {
    const response = await axios.post(
      `${url}/user/sendLinkToEmail`,
      resetPasswordLinkData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (resetPasswordData, id, token) => {
  try {
    const response = await axios.post(
      `${url}/user/resetPassword/${id}/${token}`,
      resetPasswordData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
