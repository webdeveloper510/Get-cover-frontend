import { useEffect } from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import { Outlet, useNavigate } from "react-router";
import { MyContextProvider } from './context/context';
import routes from './routes/routes';
import 'react-date-range/dist/styles.css';
function App() {
  const routing = useRoutes(routes);
  const navigate = useNavigate();
  return (
    <MyContextProvider>
      <div>
        {routing}
      </div>
    </MyContextProvider>
  );
}

export default App;
