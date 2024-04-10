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

export const priceBookFilter = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getAllPriceBooksByFilter`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResellerPortalServicers = async (filterData = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerServicers`,
      filterData,
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

export const getResellerServicers = async (filterData = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerServicers
      `,
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

export const getResellerPortalCustomers = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerCustomers`,
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

export const addPriceBook = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/createDealerPriceBook
      `,
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

export const getPriceBookDetailsForDealerPortal = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(
      `${url}/dealerPortal/getDealerPriceBookById/${data}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
