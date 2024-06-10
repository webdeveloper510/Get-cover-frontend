import axios from "axios";

// Declare the base URL of the API
const url = process.env.REACT_APP_API_KEY_LOCAL

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

export const addNewResellerForDealer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/createReseller`,
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

export const getDealersListForDealerPortal  = async (data) => {
  console.log(data);
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/admin/getDealerResellers`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardDetailsforResellerPortal = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/resellerPortal/getDashboardData`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardDetailsforServicerPortal = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/servicerPortal/getDashboardData`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};