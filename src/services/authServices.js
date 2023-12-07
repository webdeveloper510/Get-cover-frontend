// services/authService.js
import axios from "axios";

//delacring the base url of the api
const url = process.env.REACT_APP_API_KEY || "fallback_value";

//api calls
export const authlogin = async (loginDetails) => {
  try {
    const response = await axios.post(`${url}/user/login`, loginDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
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
      `${url}/serviceProvider/register`,
      serviceProviderRegisterData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
