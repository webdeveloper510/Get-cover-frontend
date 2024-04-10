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

export const addNewCustomer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/customer/createCustomer`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCustomerList = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/customer`,
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

export const getFilterCustomerList = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/customer/customer`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerListByDealerId = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/getDealerCustomers/${id}`,
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
export const getCustomerListByDealerIdAndResellerId = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/order/getCustomerInOrder`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceCoverageDetails = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/order/getServiceCoverage/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUserListByCustomerId = async (data, id) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/getCustomerUsers/${id}`,
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
export const getCustomerDetailsById = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/customer/getCustomerById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerDetailsById = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(
      `${url}/customer/editCustomer/${id}`,
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

export const getCustomerUsersById = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/getCustomerUsers/${id}`,
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
export const getCustomerUsersByIdCustomerPortal = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customerPortal/getCustomerUsers`,
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
export const getUsersByIdresellerPortal = async (id, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerUsers`,
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

export const getCustomerDetailsByIdCustomerPortal = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/customerPortal/getCustomerDetails`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetailsByIdResellerPortal = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerDetails`,{},
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderListByCustomerId = async (id, data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/customerOrders/${id}`,
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

export const getContractsforCustomer = async (id, data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customer/getCustomerContract/${id}`,
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
