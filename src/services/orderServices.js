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

export const getOrders = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/order/getAllOrders`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fileValidation = async (data) => {
  console.log(data);
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/order/checkFileValidation`,
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

export const checkMultipleFileValidation = async (data) => {
  console.log(data);
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/order/checkMultipleFileValidation`,
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
export const addOrder = async (data) => {
  console.log(data);
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }
  console.log(headers);
  try {
    const response = await axios.post(`${url}/order/createOrder`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCategoryAndPriceBooks = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/order/getCategoryAndPriceBooks/${id}`,
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

export const getServicerListInOrders = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/order/getServicerInOrders`,
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
