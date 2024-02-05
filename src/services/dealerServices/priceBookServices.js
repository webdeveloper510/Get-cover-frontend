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

export const getPriceBookForDealer = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getPriceBooks`,
      {},
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const priceBookFilter = async (filterData = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getAllPriceBooksByFilter`,
      { filterData },
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealerServicers = async (filterData = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerServicers`,
      filterData,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResellerList = async (data) => {
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

export const getDealerCustomers = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerCustomers`,
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
