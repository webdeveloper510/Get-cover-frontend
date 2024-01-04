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

export const addNewServicer = async (data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/servicer/createServiceProvider`,
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

export const addNewServicerRequest = async (status, data) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(`${url}/servicer/servicers/${status}`, data,{
      headers,
    });

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
    const response = await axios.delete(
      `${url}/servicer/rejectServicer/${data.id}`,
      { headers }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicerDetailsByid = async (id) => {
  const headers = createHeaders();
  console.log(id);

  try {
    const response = await axios.get(
      `${url}/servicer/getServiceProviderById/${id.id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveServicer = async (id, value) => {
  const headers = createHeaders();
  console.log(id);

  try {
    const response = await axios.put(
      `${url}/servicer/approveServicer/${id}`,
      value,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeServicerStatus = async (id, data) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.put(
      `${url}/servicer/editServicerDetail/${id}`,
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
