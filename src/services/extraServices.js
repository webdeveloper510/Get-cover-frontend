import axios from "axios";

//delacring the base url of the api
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

export const getNotifications = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/user/getAllNotifications
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

export const getNotificationsCount = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/user/getCountNotification
       `,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotifications = async (id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(
      `${url}/user/readNotification/${id}
       `,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getDealerList = async () => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/dealer/dealers
          `,
      {},
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractValues = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/contract/getContractById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editContractValues = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/contract/getContractById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editContractById = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(
      `${url}/contract/editContract/${id}`,
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

export const getUserDetailsbyToken = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/getUserByToken`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editUserDetailsbyToken = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/updateProfile`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePasswordbyToken = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(`${url}/user/updatePassword`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSuperAdminMembers = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/addMember`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSuperAdminMembers = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/getMembers`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendNotifications = async (data, id) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(`${url}/user/updateUser/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePrimaryById = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(
      `${url}/user/changePrimaryUser/${id}`,
      {},
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
