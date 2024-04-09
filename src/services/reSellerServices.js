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

export const addNewReseller = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/reseller/createReseller`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResellerList = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/reseller/getAllResellers`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResellerListByDealerId = async (data, id) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealer/getDealerResellers/${id}
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

export const getResellerListOrderByDealerId = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/order/getDealerResellers
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

export const changeResellerStatus = async (id, data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/reseller/changeResellerStatus/${id}`,
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

export const getResellerListByResellerId = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/reseller/getResellerById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderListByResellerId = async (id, data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reseller/resellerOrders/${id}`,
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
export const getPriceBookListByResellerId = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reseller/getResellerPriceBook/${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResellerPortalPriceBook = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerPriceBook`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getResellerUsersById = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reseller/getResellerUsers/${id}`,
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

export const addUserByResellerId = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/reseller/addResellerUser`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editResellerData = async (data, id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.put(
      `${url}/reseller/editResellers/${id}`,
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

export const getDealerDetailsId = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/reseller/getDealerByReseller/${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCustomerByDealerId = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/getResellerCustomers/${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResellerServicers = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reseller/getResellerServicers/${id}`,
      data,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractsforReseller = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/reseller/getResellerContract/${id}`,
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
