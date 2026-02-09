import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Cek apakah ada token di penyimpanan browser
  const token = localStorage.getItem("token");

  // Jika ada token, silakan masuk (Outlet). Jika tidak, tendang ke Login (Navigate to /).
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;