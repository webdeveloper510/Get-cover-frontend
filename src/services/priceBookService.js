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

// API calls
export const addCategory = async (categoryDetails) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/price/createPriceBookCategory`,
      categoryDetails,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryList = async (fitervalue) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/price/getPriceBookCategories`,
      { ...fitervalue },
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryListCoverage = async (id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.get(`${url}/price/getCoverageType/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCoverageTypeAndAdhDays = async (id, dealerId) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/price/getCoverageTypeAndAdhDays/${id}`,
      { dealerId: dealerId },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCategoryListActiveData = async (value, id) => {
  const headers = createHeaders();
  console.log(headers);
  try {
    const response = await axios.post(
      `${url}/price/getActivePriceBookCategories?priceBookId=${id}`,
      value,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editCategoryList = async (id, categoryListData) => {
  const headers = createHeaders();

  try {
    const response = await axios.put(
      `${url}/price/updatePriceBookCategory/${id}`,
      categoryListData,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyPriceList = async (filterData) => {
  const headers = createHeaders();
  try {
    const response = await axios.post(
      `${url}/price/priceBooks`,
      { ...filterData },
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editCompanyList = async (id, categoryListData) => {
  const headers = createHeaders();
  delete categoryListData.term;
  try {
    const response = await axios.put(
      `${url}/price/updatePriceBook/${id}`,
      {
        ...categoryListData,
      },
      { headers }
    );

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

export const getCovrageList = async () => {
  const headers = createHeaders();

  try {
    const response = await axios.get(`${url}/user/getOptions/coverage_type`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCompanyPricBook = async (companyPriceBookDetails) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(
      `${url}/price/createPriceBook`,
      companyPriceBookDetails,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDealerList = async () => {
  const headers = createHeaders();

  try {
    const response = await axios.post(`${url}/admin/approveDealers`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(
      `${url}/price/getPriceBookCategoryById/${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyPriceBookById = async (id) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(`${url}/price/getPriceBookById/${id}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPriceBookByDealerId = async (id) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(
      `${url}/dealer/getDealerPriceBookByDealerId/${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadDealerBookInBulk = async (data) => {
  const accessToken = getAccessToken();
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  if (accessToken) {
    headers["x-access-token"] = accessToken;
  }

  try {
    const response = await axios.post(
      `${url}/dealer/uploadDealerPriceBook`,
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
