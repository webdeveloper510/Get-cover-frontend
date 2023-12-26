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

export const getTermList = async () => {
  const headers = createHeaders();

  try {
    const response = await axios.get(`${url}/user/getAllTerms`, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isApprovedOrDisapprovedStatus = async (data) => {
  console.log(data);
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.put(
      `${url}/admin/rejectDealer/${data.id}`,
      {
        status: data.action,
      },
      { headers }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealersList = async () => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(`${url}/admin/approveDealers`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealersDetailsByid = async (id) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(`${url}/dealer/getDealerById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkDealersEmailValidation = async (email) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/user/checkEmail`,
      {
        email: email,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProductListbyProductCategoryId = async (categoryId) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(
      `${url}/price/getPriceBookByCategoryId/${categoryId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealerPriceBook = async (categoryId) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(`${url}/dealer/dealerPriceBooks`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewOrApproveDealer = async (data) => {
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }
  console.log(headers);
  try {
    const response = await axios.post(`${url}/admin/createDealer`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const validateDealerData = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(`${url}/admin/validateData`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addDealerPriceBook = async (data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/dealer/createDealerPriceBook`,
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
export const getDealerPricebookDetailById = async (id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(
      `${url}/dealer/getDealerPriceBookById/${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editDealerPriceBook = async (id, data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.put(
      `${url}/dealer/updateDealerPriceBook/${id}`,
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
