import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Auth() {
  const location = useLocation();
  const [login, setLogin] = useState(true);

  useEffect(() => {
    if (location.pathname === "/login") {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [location]);

  return login ? <Login /> : <Signup />;
}

export default Auth;
