// services/authService.js
import axios from "axios";

//delacring the base url of the api
const url = process.env.REACT_APP_API_KEY || "fallback_value";
export const authlogin = async (loginDetails) => {
  try {
    const response = await axios.post(`${url}/user/login`, loginDetails);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
