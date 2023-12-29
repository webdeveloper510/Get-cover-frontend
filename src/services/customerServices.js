import axios from "axios";

// Declare the base URL of the API
const url = process.env.REACT_APP_API_KEY || "fallback_value";

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

export const addNewCustomer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/customer/createCustomer`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
