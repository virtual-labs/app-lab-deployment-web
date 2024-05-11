import React from "react";
import BackImg from "./media/introduction.webp";
import "./css/index.css";
import NavBar from "./components/NavBar";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <div className="flex flex-col bg-gray-100 font-sans h-full w-full overflow-hidden">
        <div className="flex-1 text-center py-0 relative">
          <img src={BackImg} className=" object-cover" />
          <div className="landpage-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
            <h2 className="text-3xl font-bold mb-4">Lab Deployment</h2>
            <p className="text-lg">
              Expanding educational horizons through interactive virtual
              experiences and inclusive learning initiatives
            </p>
            <div className="w-full flex flex-col items-center justify-center">
              <Link
                className="submit-button w-button text-center w-32 m-4"
                to="/dashboard"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        <div className="footer text-white text-center py-4">
          <p>&copy; 2024 Virtual Labs. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Landing;
