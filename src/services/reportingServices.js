import axios from "axios";

// Declare the base URL of the API
const url = process.env.REACT_APP_API_KEY_LOCAL;

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

export const getAllSales = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/saleReporting`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClaims = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/claimReporting`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFilterList = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reporting/getReportingDropdowns`,
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

export const getFilterListForClaim = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reporting/claimReportinDropdown`,
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

export const getFilterListForDealerClaim = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/claimReportinDropdown`,
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

export const getAllSalesForDealer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/saleReporting`,
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

export const getAllClaimsForDealer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/claimReporting`,
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
