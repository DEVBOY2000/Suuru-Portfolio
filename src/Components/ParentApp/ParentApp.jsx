import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import FlotingEdition from "../FlotingEdition/FlotingEdition";
import DeleteButton from "../DeleteButton/DeleteButton";
import { AppContext } from "../../Context/AppContext";
import Modal from "../../Modal/Modal";
import { globalIcons } from "../../Utils/GlobalIcons";

const ParentApp = () => {
  const { editState } = useContext(AppContext);

  const { pathname } = useLocation();

  const handlingParentStyle = () => {
    return pathname === "/Suuru-Portfolio"
      ? "mb-[92px] sm:mb-[72px]"
      : !pathname.includes("/project")
      ? `min-h-[calc(100vh_-_92px)] h-[calc(100vh_-_96px)] sm:h-[calc(100vh_-_72px)] ${
          !pathname.includes("login")
            ? "pt-[64px] sm:mb-[72px] overflow-auto"
            : "h-[100vh_!important]"
        }`
      : "mb-[-60px] min-h-[calc(100vh_-_92px)] min-h-[calc(100vh_-_96px)] sm:min-h-[calc(100vh_-_72px)] pt-[57px] ";
  };

  return (
    <div className="dark:bg-dark-color bg-white">
      <Navbar />
      <div className={`relative ${handlingParentStyle()}`}>
        <Outlet />
      </div>
      {pathname.includes("/Suuru-Portfolio/project/") && <FlotingEdition />}
      <Footer />
      {pathname !== "/Suuru-Portfolio" && editState && <Modal />}
    </div>
  );
};

export default ParentApp;
globalIcons();
