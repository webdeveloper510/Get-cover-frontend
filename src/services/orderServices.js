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
export const getContracts = async (id, data = {}) => {
  console.log(id,data)
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/order/getOrderContract/${id}`,
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
export const getArchiveOrders = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/order/getArchieveOrder`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markPaid = async (id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(`${url}/order/markAsPaid/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const archiveOrders = async (id, data = {}) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/order/archiveOrder/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const processOrders = async (id, data = {}) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/order/processOrder/${id}`, data, {
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
export const checkEditFileValidations = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/order/editFileCase`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addOrder = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/order/createOrder`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editOrder = async (id, data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/order/editOrderDetail/${id}`,
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

export const getStep2Validation = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/order/checkPurchaseOrder`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const orderDetailsById = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/order/getOrderById/${id}
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

export const getAllContractsForAdmin = async (data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/contract/getAllContracts`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExportOrderHtml = async (id, data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/order/generatePDF/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrderServicer = async (id, data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.put(
      `${url}/order/updateServicerByOrder/${id}`,
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

export const getOrderCustomer = async ( data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customerPortal/getCustomerOrder`,
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
export const getOrderDetailCustomer = async (id, data = {}) => {
  const headers = createHeaders();                                                                 
  try {
    const response = await axios.get(
      `${url}/customerPortal/getOrderById/${id}`,
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
