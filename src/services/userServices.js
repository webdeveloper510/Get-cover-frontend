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

export const getUserListByDealerId = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/dealer/getUserByDealerId/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePrimaryByUserId = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/customer/changePrimaryUser/${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserByUserId = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.delete(`${url}/user/deleteUser/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userDetailsById = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/getUserById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateUserDetailsById = async (data) => {
  let id = data.id;
  delete data.id;
  const headers = createHeaders();
  try {
    const response = await axios.put(`${url}/user/updateUserData/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addUserByDealerId = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/dealer/addDealerUser`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
