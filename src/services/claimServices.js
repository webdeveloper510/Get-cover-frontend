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
