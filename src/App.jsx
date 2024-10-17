import React, { useEffect, useState } from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import { MyContextProvider } from './context/context';
import routes from './routes/routes';
import { getSetting } from './services/extraServices';

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [sideBarColor, setSideBarColor] = useState('');
  const [sideBarTextColor, setSideBarTextColor] = useState('');
  const routing = useRoutes(routes);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details...");
        const userDetails = await getSetting();
        console.log("User details fetched:", userDetails);

        if (userDetails && userDetails.result && userDetails.result.length > 0) {
          const fetchedData = userDetails.result[0];
          localStorage.setItem("siteSettings", JSON.stringify(fetchedData));
          setSiteSettings(fetchedData);
          const colorScheme = fetchedData.colorScheme;
          colorScheme.forEach(color => {
            switch (color.colorType) {
              case 'sideBarColor':
                setSideBarColor(color.colorCode);
                break;
              case 'sideBarTextColor':
                setSideBarTextColor(color.colorCode);
                break;
              default:
                break;
            }
          })
        } else {
          console.log("User details are invalid or empty.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    console.log('herrrrrrrrrrrrrrrrrrrrrr', siteSettings)
    if (siteSettings) {
      console.log("User details are valid, updating favicon...");
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      console.log(`${siteSettings?.favIcon?.baseUrl}uploads/logo/${siteSettings?.favIcon?.fileName}`);
      link.href = `${siteSettings?.favIcon?.baseUrl}uploads/logo/${siteSettings?.favIcon?.fileName}`;
      document.title = siteSettings?.title || 'Default Title';
    }
  }, [siteSettings]);

  return (
    <MyContextProvider>
      <div>
        <style>
          {`
        .rdt_Pagination {
          background-color: ${sideBarColor} !important;
          color: ${sideBarTextColor} !important;
        }
      `}
        </style>
        {routing}
      </div>
    </MyContextProvider>
  );
}

export default App;
