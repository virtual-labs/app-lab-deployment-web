// Callback component to handle GitHub redirect
// Callback.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { AUTH_API } from "./utils/config_data";

const Callback = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (code) {
        try {
          const response = await axios.post(AUTH_API, { code });
          const accessToken = response.data.access_token;
          localStorage.setItem("accessToken", accessToken);
          navigate("/dashboard");
        } catch (error) {
          alert("Error exchanging GitHub code for access token");
          console.error("Error exchanging GitHub code for access token", error);
        }
      }
    };

    handleCallback();
  }, [code]);

  return <div>Logging in...</div>;
};

export default Callback;
