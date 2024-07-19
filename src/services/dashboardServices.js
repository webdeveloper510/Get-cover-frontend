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

export const getDashboardDetails = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/order/getDashboardData`,
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

export const getDashboardList = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/getDashboardInfo`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealerDashboardList = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/dealerPortal/getDashboardInfo`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicerDashboardList = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/servicerPortal/getDashboardInfo`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getDealerDashboardListReseller = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/resellerPortal/getDashboardInfo`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboard = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/user/getDashboardGraph`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardForDealer = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/dealerPortal/getDashboardGraph`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardForServicer = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/servicerPortal/getDashboardGraph`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardForReseller = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/resellerPortal/getDashboardGraph`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCustomerDashboardDetails = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/customerPortal/getDashboardData`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardForCustomer = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(
      `${url}/customerPortal/getDashboardGraph`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerDashboardList = async () => {
  const headers = createHeaders();
  try {
    const response = await axios.get(`${url}/customerPortal/getDashboardInfo`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};