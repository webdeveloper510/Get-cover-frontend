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

export const getPendingDealersList = async () => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(`${url}/admin/pendingDealers`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isApprovedOrDisapprovedStatus = async (dealerId, dealerStatus) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.put(
      `${url}/admin/rejectDealer/${dealerId}`,
      dealerStatus,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealersList = async () => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(`${url}/admin/dealers`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};