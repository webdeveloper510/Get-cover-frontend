import { useEffect } from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import { Outlet, useNavigate } from "react-router";
import routes from './routes/routes';
function App() {
  const routing = useRoutes(routes);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  }, []);
  return (
    <>
      <div>
        {routing}
      </div>
    </>
  );
}

export default App;
