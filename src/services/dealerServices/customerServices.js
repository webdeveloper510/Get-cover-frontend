import axios from "axios";

// Declare the base URL of the API
const url =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_KEY_PROD
    : process.env.REACT_APP_API_KEY_LOCAL;

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

export const getResellerListForDealer = async (data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerResellers`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewCustomerDealer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/createCustomer`,
      data,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
