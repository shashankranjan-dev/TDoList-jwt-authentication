import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import { Auth, Error404, Home } from "./pages/Index";
import { Navigate } from "react-router-dom";

export default function Router() {
  // eslint-disable-next-line no-undef
  const version = process.env.REACT_APP_VERSION;

  const PrivateRoute = ({ component: Component, ...rest }) => {
    const authed = localStorage.getItem("token");
    return authed ? <Component /> : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ component: Component, ...rest }) => {
    const authed = localStorage.getItem("token");
    return authed ? <Navigate to="/" replace /> : <Component />;
  };

  return (
    <>
      <div className="fixed z-100 bottom-2 left-4 text-gray-400">
        <p>v{version}</p>
      </div>
      <ScrollToTop />

      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<PrivateRoute component={Home} />} />
        <Route path="/login" element={<PublicRoute component={Auth} />} />
        <Route path="/signup" element={<PublicRoute component={Auth} />} />
      </Routes>
    </>
  );
}
