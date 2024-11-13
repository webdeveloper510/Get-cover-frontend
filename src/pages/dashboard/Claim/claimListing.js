import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const ClaimListing = () => {
  const { claimId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CC-2024-100131')
  if (userInfo) {
      if (userInfo.role == 'Super Admin') {
        navigate(`/claimList/${claimId}`);
      } else if (userInfo.role === 'Dealer') {
        navigate(`/dealer/claimList/${claimId}`);
      }
      else if (userInfo.role === 'Reseller') {
        navigate(`/reseller/claimList/${claimId}`);
      }
      else if (userInfo.role === 'Servicer') {
        navigate(`/servicer/claimList/${claimId}`);
      }
      else if (userInfo.role === 'Customer') {
        navigate(`/customer/claimList/${claimId}`);
      } 
      else {
        navigate('/login');
      }
    }
  }, [ claimId, navigate]);

  return null;
};

export default ClaimListing;
