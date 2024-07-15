import React, { useEffect } from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import { MyContextProvider } from './context/context';
import routes from './routes/routes';
import { getSetting } from './services/extraServices';

function App() {
  const routing = useRoutes(routes);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details...");
        const userDetails = await getSetting();
        console.log("User details fetched:", userDetails);

        if (userDetails && userDetails.result && userDetails.result.length > 0) {

          console.log("User details are valid, updating favicon...");
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = `https://api.codewarranty.com/uploads/logo/${userDetails.result[0].favIcon.fileName}`;
          document.title = userDetails.result[0].title || 'Default Title';
        } else {
          console.log("User details are invalid or empty.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);


  return (
    <MyContextProvider>
      <div>
        {routing}
      </div>
    </MyContextProvider>
  );
}

export default App;
