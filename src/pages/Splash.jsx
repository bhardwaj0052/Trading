import React, { useEffect } from "react";
import "./Splash.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("2ndtredingWeb");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleContinue = () => {
    navigate("/register");
  };

  return (
    <div className="splash-container">
      <div className="splash-card">

        <img
          src="/splash.png"
          alt="Trading"
          className="splash-image"
        />

        <h1 className="splash-title">
          Building Wealth
          <br />
          Together
        </h1>

        <p className="splash-subtitle">
          A smarter way to invest — track progress, gain confidence
          and build wealth with powerful insights.
        </p>

        <button
          className="splash-btn"
          onClick={handleContinue}
        >
          Get Started
        </button>

      </div>
    </div>
  );
}

export default Splash;