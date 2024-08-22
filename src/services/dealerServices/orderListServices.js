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

export const getDealerOrderList = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerOrders`,
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

export const getOrdersForDealerPortal = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerOrders`,
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

export const getAllContractsForDealerPortal = async (data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerContracts`,
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

export const getAllContractsForCustomerPortal = async (data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/customerPortal/getCustomerContract`,
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

export const getResellerListforDealerPortal = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerResellers
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

export const getServicerListInOrdersforDealerPortal = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getServicerInOrders`,
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

export const getCustomerListforDealerPortal = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getCustomerInOrder`,
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

export const getCategoryAndPriceBooksforDealerPortal = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getCategoryAndPriceBooks`,
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

export const getArchiveOrdersForDealerPortal = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/dealerPortal/getDealerArchievedOrders`,
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
export const getArchiveOrdersForResellerPortal = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/resellerPortal/getArchieveOrder`,
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
export const addOrderforDealerPortal = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/dealerPortal/createOrder`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editOrderforDealerPortal = async (id, data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/dealerPortal/editOrderDetail/${id}`,
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

export const editOrderforResellerPortal = async (id, data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/resellerPortal/editOrderDetail/${id}`,
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

export const getContractByIdCustomerPortal = async (id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(
      `${url}/customerPortal/getContractById/${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
