import axios from "axios";
// Declare the base URL of the API
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

export const getContractList = async (data = {}) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/claim/searchClaim`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractPrice = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/claim/getMaxClaimAmount/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractValues = async (id) => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/claim/getContractById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadClaimEvidence = async (data) => {
  const accessToken = getAccessToken(); // Assuming getAccessToken returns the access token
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }

  try {
    const response = await axios.post(`${url}/claim/uploadReceipt`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addClaim = async (data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(`${url}/claim/createClaim`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimList = async (data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(`${url}/claim/getAllClaims`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimListForDealer = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/dealer/getDealerClaims/${id}`,
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

export const getUnpaidClaims = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/servicer/getPaidUnpaidClaims/${id}`,
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
export const getPaidClaims = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/servicer/getPaidUnpaidClaims/${id}`,
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

export const getClaimListForReseller = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/reseller/getResellerClaims/${id}`,
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

export const getClaimListForResellerPortal = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/resellerPortal/getResellerClaims`,
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

export const getClaimListForCustomer = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/customer/customerClaims/${id}`,
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

export const getClaimListForServicer = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/servicer/getServicerClaims/${id}`,
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

export const addClaimsRepairParts = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.put(`${url}/claim/editClaim/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editClaimStatus = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.put(
      `${url}/claim/editClaimStatus/${id}`,
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

export const editClaimServicerValue = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.put(`${url}/claim/editServicer/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editClaimTypeValue = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.put(`${url}/claim/editClaimType/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markasPaidClaims = async (data) => {
  const headers = createHeaders();
  let claimIds = data;

  try {
    const response = await axios.post(
      `${url}/servicer/paidUnpaidClaim`,
      { claimIds },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimMessages = async (id) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(
      `${url}/claim/getMessages/${id}`,

      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimUnpaid = async (claimIds) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/claim/getUnpaidAmount`,
      { claimIds },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addClaimMessages = async (id, data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(`${url}/claim/sendMessages/${id}`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUploadCommentImage = async (data) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(`${url}/claim/uploadCommentImage`, data, {
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

export const uploadClaimInBulk = async (data) => {
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }

  try {
    const response = await axios.post(`${url}/claim/saveBulkClaim`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
