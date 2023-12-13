import axios from "axios";

// Declare the base URL of the API
const url = process.env.REACT_APP_API_KEY || "fallback_value";

const getAccessToken = () => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  return userDetails ? userDetails.token : null;
};

const createHeaders = () => {
  const accessToken = getAccessToken();

  if (accessToken) {
    return {
      'x-access-token': accessToken,
      'Content-Type': 'application/json'
    };
  }
};

// API calls
export const addCategory = async (categoryDetails) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(`${url}/price/createPriceBookCategory`, categoryDetails, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryList = async () => {
    const headers = createHeaders();
  
    try {
      const response = await axios.post(`${url}/price/getPriceBookCategories`,{}, { headers });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const editCategoryList = async (id,categoryListData) => {
    const headers = createHeaders();
  
    try {
      const response = await axios.put(`${url}/price/updatePriceBookCategory/${id}`,categoryListData, { headers });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getCompanyPriceList =  async () => {
    const headers = createHeaders();
  
    try {
      const response = await axios.post(`${url}/price/priceBooks`,{}, { headers });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const editCompanyList = async (id,categoryListData) => {
    const headers = createHeaders();
  
    try {
      const response = await axios.put(`${url}/price/updatePriceBook/${id}`,categoryListData, { headers });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };