

export const handleAuthError = (error) => {
    if (error && error.code === 401) {
   
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (userDetails && userDetails.token) {
        const role = userDetails.role;
        if (role === "Super Admin") {
          window.location.href = "/dashboard";
        } else if (role === "Dealer") {
          window.location.href = "/dealer/dashboard";
        } else {
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    } else {
      throw error;
    }
  };
  
  export const getUserDetails = () => {
    return JSON.parse(localStorage.getItem("userDetails"));
  };
  
  export const getAccessToken = () => {
    const userDetails = getUserDetails();
    return userDetails ? userDetails.token : null;
  };
  
  export const getUserRole = () => {
    const userDetails = getUserDetails();
    return userDetails ? userDetails.role : null;
  };
  