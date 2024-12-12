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

export const getNotificationMarks = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/user/readAllNotification
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

export const updateThreshHoldLimit = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(`${url}/user/updateThreshHoldLimit`, data, {
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

export const getUserNotificationData = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/getUserNotificationData/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/setting/uploadLogo`, data, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dealerSaveSetting = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/dealer/saveDealerSetting`, data, {
      headers: {
        ...headers,

      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const servicerSaveSetting = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/servicer/saveServicerSetting`, data, {
      headers: {
        ...headers,

      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveSetting = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/setting`, data, {
      headers: {
        ...headers,

      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const dealerGetSetting = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/dealer/getDealerColorSetting/${id}`, {
      headers: {
        ...headers,
        // Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const servicerGetSetting = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/servicer/getServicerColorSetting/${id}`, {
      headers: {
        ...headers,
        // Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSetting = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/setting/getSetting`, {
      headers: {
        ...headers,
        // Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getprelogin = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/setting/preLoginData`, {
      headers: {
        ...headers,
        // Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetSetting = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/user/resetSetting`, {
      headers: {
        ...headers,// Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dealerResetSetting = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/dealer/resetDealerSetting`, { id }, {
      headers: {
        ...headers,// Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const servicerResetSetting = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/servicer/resetServicerSetting`, { id }, {
      headers: {
        ...headers,// Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetDefault = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/setting/setDefault`, {
      headers: {
        ...headers,// Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dealerResetDefault = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/dealer/defaultSettingDealer/${id}`, {
      headers: {
        ...headers,// Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const servicerResetDefault = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/servicer/defaultSettingServicer/${id}`, {
      headers: {
        ...headers,// Set the content type to multipart/form-data
      },
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


export const getUserDetailsFromLocalStorage = () => {
  const siteSettings = localStorage.getItem("siteSettings");
  return siteSettings ? JSON.parse(siteSettings) : null;
};